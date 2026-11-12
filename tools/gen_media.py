#!/usr/bin/env python3
"""Генерация медиа для сайта FC Durum через Google Gemini API.

Ключ берётся из переменной окружения GEMINI_API_KEY или из файла .env в корне проекта
(.env в .gitignore — ключ никогда не коммитить и не печатать).

Примеры:
  python3 tools/gen_media.py image "раздевалка FC Durum, красно-чёрные шарфы" --name news-11
  python3 tools/gen_media.py image "..." --engine gemini --aspect 4:5 --out images/players/12.jpg
  python3 tools/gen_media.py video "фанаты на стадионе Кулагер зажигают файеры" --name ultras

Картинки по умолчанию: images/generated/<name>.jpg (jpg, качество 90).
Видео по умолчанию:    images/video/<name>.mp4.
Скрипт печатает путь к готовому файлу последней строкой.
"""
import argparse
import base64
import io
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = "https://generativelanguage.googleapis.com/v1beta"

IMAGEN_MODEL = "imagen-4.0-generate-001"
GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image"
VEO_MODEL = "veo-3.0-generate-001"


def load_key():
    key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not key:
        env = os.path.join(ROOT, ".env")
        if os.path.exists(env):
            for line in open(env, encoding="utf-8"):
                k, _, v = line.partition("=")
                if k.strip() == "GEMINI_API_KEY":
                    key = v.strip().strip('"').strip("'")
    if not key:
        sys.exit("GEMINI_API_KEY не найден (ни в окружении, ни в .env)")
    return key


def request(url, key, body=None, raw=False, timeout=300):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method="POST" if data else "GET")
    req.add_header("x-goog-api-key", key)
    if data:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            payload = r.read()
    except urllib.error.HTTPError as e:
        msg = e.read().decode("utf-8", "replace")[:1000]
        sys.exit(f"Ошибка API {e.code}: {msg}")
    return payload if raw else json.loads(payload)


def slug(text):
    s = re.sub(r"[^a-z0-9а-яё]+", "-", text.lower()).strip("-")
    return (s[:40] or "media") + "-" + time.strftime("%Y%m%d%H%M%S")


def save_image(img_bytes, out):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    ext = os.path.splitext(out)[1].lower()
    try:
        from PIL import Image
        im = Image.open(io.BytesIO(img_bytes))
        if ext in (".jpg", ".jpeg"):
            im.convert("RGB").save(out, "JPEG", quality=90, optimize=True)
        else:
            im.save(out)
    except ImportError:
        open(out, "wb").write(img_bytes)
    return out


def gen_image_imagen(prompt, key, aspect):
    body = {"instances": [{"prompt": prompt}],
            "parameters": {"sampleCount": 1, "aspectRatio": aspect, "personGeneration": "allow_adult"}}
    res = request(f"{API}/models/{IMAGEN_MODEL}:predict", key, body)
    preds = res.get("predictions") or []
    if not preds or "bytesBase64Encoded" not in preds[0]:
        sys.exit("Imagen не вернул картинку: " + json.dumps(res, ensure_ascii=False)[:800])
    return base64.b64decode(preds[0]["bytesBase64Encoded"])


def gen_image_gemini(prompt, key, aspect):
    body = {"contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": aspect}}}
    res = request(f"{API}/models/{GEMINI_IMAGE_MODEL}:generateContent", key, body)
    for cand in res.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                return base64.b64decode(inline["data"])
    sys.exit("Gemini не вернул картинку: " + json.dumps(res, ensure_ascii=False)[:800])


def gen_video(prompt, key, aspect, out, wait_max=900):
    body = {"instances": [{"prompt": prompt}], "parameters": {"aspectRatio": aspect}}
    op = request(f"{API}/models/{VEO_MODEL}:predictLongRunning", key, body)
    name = op.get("name")
    if not name:
        sys.exit("Veo не принял задачу: " + json.dumps(op, ensure_ascii=False)[:800])
    print(f"Veo: задача {name}, жду…", file=sys.stderr)
    start = time.time()
    while not op.get("done"):
        if time.time() - start > wait_max:
            sys.exit(f"Veo: не дождался за {wait_max} с (операция {name})")
        time.sleep(10)
        op = request(f"{API}/{name}", key)
    if "error" in op:
        sys.exit("Veo ошибка: " + json.dumps(op["error"], ensure_ascii=False)[:800])
    samples = (op.get("response", {}).get("generateVideoResponse", {}) or {}).get("generatedSamples") or []
    if not samples:
        sys.exit("Veo не вернул видео: " + json.dumps(op, ensure_ascii=False)[:800])
    uri = samples[0]["video"]["uri"]
    data = request(uri, key, raw=True, timeout=600)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "wb").write(data)
    return out


def main():
    p = argparse.ArgumentParser(description="Генерация картинок/видео для сайта FC Durum через Gemini API")
    p.add_argument("kind", choices=["image", "video"])
    p.add_argument("prompt", help="описание (лучше на английском — модели понимают его точнее)")
    p.add_argument("--engine", choices=["imagen", "gemini"], default="imagen", help="для картинок")
    p.add_argument("--aspect", default=None, help="16:9 (по умолчанию), 4:5 для игроков, 1:1, 9:16 …")
    p.add_argument("--name", help="имя файла без расширения")
    p.add_argument("--out", help="полный путь к файлу (относительно корня проекта)")
    a = p.parse_args()
    key = load_key()

    if a.kind == "image":
        aspect = a.aspect or "16:9"
        if a.engine == "imagen" and aspect == "4:5":
            aspect = "3:4"  # Imagen не умеет 4:5 — ближайший вариант
        out = a.out or f"images/generated/{a.name or slug(a.prompt)}.jpg"
        out = os.path.join(ROOT, out) if not os.path.isabs(out) else out
        img = gen_image_imagen(a.prompt, key, aspect) if a.engine == "imagen" else gen_image_gemini(a.prompt, key, aspect)
        save_image(img, out)
    else:
        aspect = a.aspect or "16:9"
        out = a.out or f"images/video/{a.name or slug(a.prompt)}.mp4"
        out = os.path.join(ROOT, out) if not os.path.isabs(out) else out
        gen_video(a.prompt, key, aspect, out)
    print(os.path.relpath(out, ROOT))


if __name__ == "__main__":
    main()
