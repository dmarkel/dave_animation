#!/usr/bin/env python3
"""Build a single self-contained page (voices embedded) for publishing.

Usage: python3 tools/build_page.py OUTPUT.html [--pilot]
(--pilot builds the cartoon-style preview instead of the full story.)
The output has no <html>/<head>/<body> wrapper, as the Artifact host adds its own.
"""
import base64, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
voices = open(os.path.join(ROOT, "voices.js"), encoding="utf-8").read()
mapping = json.loads(voices[voices.index("{"):voices.rindex("}") + 1])
embedded = {k: "data:audio/mpeg;base64," + base64.b64encode(open(os.path.join(ROOT, v), "rb").read()).decode()
            for k, v in mapping.items()}
html = html.replace('<script src="voices.js"></script>',
                    "<script>window.VOICES = " + json.dumps(embedded, ensure_ascii=False) + ";</script>")
for img in sorted(set(re.findall(r"assets/[\w-]+\.jpg", html))):
    html = html.replace(img, "data:image/jpeg;base64," + base64.b64encode(open(os.path.join(ROOT, img), "rb").read()).decode())
for name in ("voices-lips.js", "voices-timing.js"):
    code = open(os.path.join(ROOT, name), encoding="utf-8").read()
    html = html.replace(f'<script src="{name}"></script>', "<script>" + code + "</script>")
if "--pilot" in sys.argv:
    html = html.replace("<title>The Painted Bobcat</title>", "<title>Cartoon Style Preview</title><script>window.PILOT = true;</script>")
for tag in (r"<!DOCTYPE html>\n", r'<html lang="en">\n', r"<head>\n", r"</head>\n", r"<body>\n", r"</body>\n", r"</html>\n?", r"<meta [^>]*>\n"):
    html = re.sub(tag, "", html)
open(sys.argv[1], "w", encoding="utf-8").write(html)
print(f"{sys.argv[1]}: {len(html) / 1e6:.1f} MB, {len(embedded)} clips")
