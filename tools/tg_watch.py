# Сторож Telegram-группы FC Durum: раз в 2 минуты смотрит новые сообщения (через всех ботов, кто в группе),
# и завершается, когда видит упоминание Ангелины/Педро, их имена или ответ на их сообщения.
# Ничего не подтверждает и не отправляет. Токены — только из переменных окружения.
import json, os, time, urllib.request
CHAT = -5395734577
TOKENS = [t for t in (os.environ.get("TELEGRAM_BOT_TOKEN"), os.environ.get("TELEGRAM_ULTRAS_TOKEN"), os.environ.get("TELEGRAM_HATER_TOKEN")) if t]
def api(tok, m, q=""):
    return json.load(urllib.request.urlopen(f"https://api.telegram.org/bot{tok}/{m}{q}", timeout=40))
BOT_IDS, NAMES = set(), ["ангелин", "angelin", "педро", "pedro", "хейтер"]
for t in TOKENS:
    try:
        me = api(t, "getMe")["result"]; BOT_IDS.add(me["id"]); NAMES.append("@" + me["username"].lower())
    except Exception: pass
deadline = time.time() + 6600
while time.time() < deadline:
    hits = {}
    for t in TOKENS:
        try: ups = api(t, "getUpdates")["result"]
        except Exception: continue
        for u in ups:
            m = u.get("message") or u.get("edited_message")
            if not m or m.get("chat", {}).get("id") != CHAT: continue
            low = (m.get("text") or m.get("caption") or "").lower()
            r = m.get("reply_to_message") or {}
            if any(n in low for n in NAMES) or r.get("from", {}).get("id") in BOT_IDS:
                hits[m["message_id"]] = m.get("from", {}).get("first_name")
    if hits:
        print("MENTION", sorted(hits.items())); break
    time.sleep(120)
else:
    print("TIMEOUT")
