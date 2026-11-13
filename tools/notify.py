#!/usr/bin/env python3
"""Отправка push-уведомлений подписчикам сайта FC Durum (Web Push, VAPID, aes128gcm).

  python3 tools/notify.py --auto              # найти новинки (новости, посты, состав/анкеты) и разослать
  python3 tools/notify.py --auto --dry-run    # только показать, что будет отправлено
  python3 tools/notify.py --title "..." --body "..." --url "#news-18"   # своё уведомление
  python3 tools/notify.py --init              # запомнить текущее состояние сайта без рассылки

Ключи — VAPID_PRIVATE_KEY / VAPID_PUBLIC_KEY в .env (никогда не печатать и не коммитить).
Подписки читаются из Firestore (коллекция push_subs). Состояние — tools/push_state.json.
"""
import argparse, base64, hashlib, hmac, json, os, re, struct, subprocess, sys, time, urllib.request, urllib.error
from urllib.parse import urlparse
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric.utils import decode_dss_signature
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATE = os.path.join(ROOT, "tools", "push_state.json")
DEAD = os.path.join(ROOT, "tools", "push_dead.txt")
SITE = "https://biryukovplaton09.github.io/my-funproject/"


def b64d(s):
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))


def b64e(b):
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode()


def env():
    vals = dict(os.environ)
    p = os.path.join(ROOT, ".env")
    if os.path.exists(p):
        for line in open(p):
            if "=" in line and not line.lstrip().startswith("#"):
                k, v = line.strip().split("=", 1)
                vals.setdefault(k, v)
    return vals


# ---------- Web Push ----------
def vapid_header(endpoint, priv_b64, pub_b64):
    u = urlparse(endpoint)
    head = b64e(json.dumps({"typ": "JWT", "alg": "ES256"}, separators=(",", ":")).encode())
    claims = b64e(json.dumps({"aud": f"{u.scheme}://{u.netloc}", "exp": int(time.time()) + 12 * 3600,
                              "sub": SITE}, separators=(",", ":")).encode())
    key = ec.derive_private_key(int.from_bytes(b64d(priv_b64), "big"), ec.SECP256R1())
    r, s = decode_dss_signature(key.sign(f"{head}.{claims}".encode(), ec.ECDSA(hashes.SHA256())))
    sig = b64e(r.to_bytes(32, "big") + s.to_bytes(32, "big"))
    return f"vapid t={head}.{claims}.{sig}, k={pub_b64}"


def hkdf(salt, ikm, info, n):
    prk = hmac.new(salt, ikm, hashlib.sha256).digest()
    return hmac.new(prk, info + b"\x01", hashlib.sha256).digest()[:n]


def encrypt(payload, p256dh, auth):
    ua_pub = b64d(p256dh)
    auth_secret = b64d(auth)
    as_key = ec.generate_private_key(ec.SECP256R1())
    as_pub = as_key.public_key().public_bytes(serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint)
    shared = as_key.exchange(ec.ECDH(), ec.EllipticCurvePublicKey.from_encoded_point(ec.SECP256R1(), ua_pub))
    ikm = hkdf(auth_secret, shared, b"WebPush: info\x00" + ua_pub + as_pub, 32)
    salt = os.urandom(16)
    cek = hkdf(salt, ikm, b"Content-Encoding: aes128gcm\x00", 16)
    nonce = hkdf(salt, ikm, b"Content-Encoding: nonce\x00", 12)
    ct = AESGCM(cek).encrypt(nonce, payload + b"\x02", None)
    return salt + struct.pack(">I", 4096) + bytes([len(as_pub)]) + as_pub + ct


def send(sub, data, keys):
    body = encrypt(json.dumps(data, ensure_ascii=False).encode(), sub["p256dh"], sub["auth"])
    req = urllib.request.Request(sub["endpoint"], data=body, method="POST", headers={
        "Content-Encoding": "aes128gcm", "Content-Type": "application/octet-stream", "TTL": "86400",
        "Urgency": "normal", "Authorization": vapid_header(sub["endpoint"], keys["VAPID_PRIVATE_KEY"], keys["VAPID_PUBLIC_KEY"]),
    })
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception as e:
        return f"error: {type(e).__name__}"


# ---------- Подписки из Firestore ----------
def firebase_cfg():
    s = open(os.path.join(ROOT, "js", "firebase-config.js")).read()
    return re.search(r'apiKey:\s*"([^"]+)"', s).group(1), re.search(r'projectId:\s*"([^"]+)"', s).group(1)


def subscriptions():
    api, proj = firebase_cfg()
    out, token = [], ""
    while True:
        url = f"https://firestore.googleapis.com/v1/projects/{proj}/databases/(default)/documents/push_subs?pageSize=300&key={api}"
        if token:
            url += "&pageToken=" + token
        with urllib.request.urlopen(url, timeout=20) as r:
            j = json.load(r)
        for d in j.get("documents", []):
            f = d.get("fields", {})
            g = lambda k: f.get(k, {}).get("stringValue", "")
            out.append({"id": d["name"].rsplit("/", 1)[1], "endpoint": g("endpoint"), "p256dh": g("p256dh"), "auth": g("auth")})
        token = j.get("nextPageToken")
        if not token:
            return out


# ---------- Что нового на сайте ----------
def site_data():
    js = (
        "global.window={};require('./js/data.js');require('./js/posts.js');"
        "console.log(JSON.stringify({news:window.NEWS,posts:window.POSTS||[],players:window.PLAYERS}))"
    )
    return json.loads(subprocess.check_output(["node", "-e", js], cwd=ROOT))


def player_hash(p):
    return hashlib.sha256(json.dumps(p, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]


def snapshot(d):
    return {"news": max(n["id"] for n in d["news"]), "posts": max([p["id"] for p in d["posts"]] or [0]),
            "players": {str(p["id"]): player_hash(p) for p in d["players"]}}


def short(s, n=110):
    s = re.sub(r"\s+", " ", s or "").strip()
    return s if len(s) <= n else s[: n - 1].rstrip() + "…"


def changes(d, st):
    msgs = []
    for n in sorted((n for n in d["news"] if n["id"] > st["news"]), key=lambda n: n["id"]):
        msgs.append({"title": "Новость FC Durum", "body": short(n["title"], 140), "url": f"#news-{n['id']}",
                     "image": n.get("image"), "tag": f"news-{n['id']}"})
    for p in sorted((p for p in d["posts"] if p["id"] > st["posts"]), key=lambda p: p["id"]):
        who = next((x["name"] for x in d["players"] if x["id"] == p.get("author")), None) or "FC Durum"
        msgs.append({"title": f"Новый пост в Ленте: {who}", "body": short(p.get("text", "")), "url": f"#post-{p['id']}",
                     "tag": f"post-{p['id']}"})
    old = st.get("players", {})
    for p in d["players"]:
        k = str(p["id"])
        if k not in old:
            where = "в академию" if p.get("academy") else "в состав"
            msgs.append({"title": "Изменения в составе", "body": f"{p['name']} — новый игрок, добавлен {where}.",
                         "url": f"#player-{p['id']}", "tag": f"player-{p['id']}"})
        elif old[k] != player_hash(p):
            msgs.append({"title": "Обновлена анкета игрока", "body": f"{p['name']}: на сайте изменения в анкете.",
                         "url": f"#player-{p['id']}", "tag": f"player-{p['id']}"})
    gone = [k for k in old if k not in {str(p["id"]) for p in d["players"]}]
    if gone:
        msgs.append({"title": "Изменения в составе", "body": "Состав FC Durum обновлён.", "url": "#team", "tag": "team"})
    return msgs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--auto", action="store_true")
    ap.add_argument("--init", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--title"); ap.add_argument("--body"); ap.add_argument("--url", default="")
    a = ap.parse_args()

    d = site_data() if (a.auto or a.init) else None
    if a.init:
        json.dump(snapshot(d), open(STATE, "w"), ensure_ascii=False, indent=1)
        print("состояние сохранено")
        return
    if a.auto:
        st = json.load(open(STATE)) if os.path.exists(STATE) else snapshot(d)
        msgs = changes(d, st)
        if len(msgs) > 3:  # не заваливать подписчиков: при пачке — одно сводное уведомление
            msgs = [{"title": "Новинки на сайте FC Durum", "body": f"{len(msgs)} обновлений: " +
                     "; ".join(short(m["body"], 40) for m in msgs[:3]) + "…", "url": msgs[0]["url"], "tag": "digest"}]
    else:
        if not a.title:
            sys.exit("нужно --auto или --title")
        msgs = [{"title": a.title, "body": a.body or "", "url": a.url}]

    if not msgs:
        print("новинок нет")
        return
    for m in msgs:
        print("•", m["title"], "—", m["body"], m["url"])
    if a.dry_run:
        return

    keys = env()
    if not keys.get("VAPID_PRIVATE_KEY"):
        sys.exit("нет VAPID_PRIVATE_KEY в .env")
    dead = set(open(DEAD).read().split()) if os.path.exists(DEAD) else set()
    subs = [s for s in subscriptions() if s["id"] not in dead and s["endpoint"]]
    ok = fail = 0
    for s in subs:
        for m in msgs:
            code = send(s, {k: v for k, v in m.items() if v}, keys)
            if code in (200, 201, 202):
                ok += 1
            else:
                fail += 1
                if code in (404, 410):
                    dead.add(s["id"])
                    break
                print("  не доставлено:", urlparse(s["endpoint"]).netloc, code)
    open(DEAD, "w").write("\n".join(sorted(dead)) + ("\n" if dead else ""))
    if a.auto:
        json.dump(snapshot(d), open(STATE, "w"), ensure_ascii=False, indent=1)
    print(f"подписчиков: {len(subs)}, доставлено: {ok}, ошибок: {fail}")


if __name__ == "__main__":
    main()
