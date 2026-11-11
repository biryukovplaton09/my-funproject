# Ждёт новое сообщение в группе, где упомянут бот или ответ боту. Ничего не подтверждает и не отвечает.
import json, os, time, urllib.request
T = os.environ["TELEGRAM_BOT_TOKEN"]; CHAT = -5395734577
def api(m, q=""):
    return json.load(urllib.request.urlopen(f"https://api.telegram.org/bot{T}/{m}{q}", timeout=70))
me = api("getMe")["result"]; BOT_ID, BOT_UN = me["id"], "@" + me["username"].lower()
deadline = time.time() + 6600
while time.time() < deadline:
    try:
        ups = api("getUpdates", "?timeout=50")["result"]
    except Exception as e:
        time.sleep(30); continue
    hits = []
    for u in ups:
        m = u.get("message") or u.get("edited_message")
        if not m or m.get("chat", {}).get("id") != CHAT: continue
        txt = (m.get("text") or m.get("caption") or "")
        r = m.get("reply_to_message") or {}
        low = txt.lower()
        if BOT_UN in low or "ангелин" in low or "angelin" in low or r.get("from", {}).get("id") == BOT_ID:
            hits.append((u["update_id"], m["message_id"], m.get("from", {}).get("first_name")))
    if hits:
        print("MENTION", hits); break
    time.sleep(60)
else:
    print("TIMEOUT")
