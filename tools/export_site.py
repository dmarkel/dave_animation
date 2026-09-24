#!/usr/bin/env python3
"""Copy the presentation into a website folder (e.g. the Pack 149 site's bobcat-ceremony/).

Usage: python3 tools/export_site.py <dest dir> [--back-link URL] [--back-text TEXT]

Copies index.html, the voice clips and timing files, and the cartoon backdrop; the clips stay
separate files so the page loads fast and the browser fetches each voice line as needed.
"""
import argparse, html, os, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument("dest")
ap.add_argument("--back-link")
ap.add_argument("--back-text", default="Back to Pack 149")
a = ap.parse_args()

dest = os.path.abspath(a.dest)
if os.path.isdir(dest):
    shutil.rmtree(dest)
os.makedirs(os.path.join(dest, "assets"))
page = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
if a.back_link:
    link = (f'<a class="site-back" href="{html.escape(a.back_link)}">&larr; {html.escape(a.back_text)}</a>')
    style = ("  .site-back { align-self: flex-start; color: var(--gold); font-weight: 700; font-size: max(13px, 1.5cqw);"
             " text-decoration: none; }\n  .site-back:hover, .site-back:focus-visible { text-decoration: underline; }\n"
             "  body.record .site-back { display: none; }\n")
    page = page.replace('<div id="app">', '<div id="app">\n  ' + link, 1).replace("  body.paused *, body.paused", style + "  body.paused *, body.paused", 1)
open(os.path.join(dest, "index.html"), "w", encoding="utf-8").write(page)
for f in ("voices.js", "voices-lips.js", "voices-timing.js"):
    shutil.copy(os.path.join(ROOT, f), dest)
shutil.copytree(os.path.join(ROOT, "voices"), os.path.join(dest, "voices"), ignore=shutil.ignore_patterns("*.json"))
shutil.copy(os.path.join(ROOT, "assets", "bg-cartoon.jpg"), os.path.join(dest, "assets"))
size = sum(os.path.getsize(os.path.join(d, f)) for d, _, fs in os.walk(dest) for f in fs)
print(f"exported to {dest} ({size / 1e6:.1f} MB)")
