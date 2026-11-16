#!/usr/bin/env python3
"""EFshield demo: surenka puslapius iš src/templates + src/data/site.json į šakninius *.html.

Naudojimas:  python3 build.py
Reikia:      Python 3 + jinja2 (pip install jinja2)

Kas generuojama:
  index.html                      pirmas puslapis
  preke-wifi-skydas.html          prekės puslapis (WIFI skydas)
  preke-telefono-skydas.html      prekės puslapis (Telefono skydas)
Redaguojami tik failai kataloguose src/ ir assets/.
"""
import json
import math
import re
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, StrictUndefined
from markupsafe import Markup

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"


# ------------------------------------------------------------------ ikonų rinkinys (Phosphor Light, MIT)
def used_icons():
    """Į rinkinį dedamos tik šablonuose ir scenarijuose naudojamos ikonos."""
    names = set()
    for f in list((SRC / "templates").rglob("*.html")) + list((ROOT / "assets" / "js").glob("*.js")):
        text = f.read_text(encoding="utf-8")
        names.update(re.findall(r"icon\('([a-z0-9-]+)'", text))
        names.update(re.findall(r"#i-([a-z0-9-]+)", text))
    return names


def icon_symbols():
    out = []
    used = used_icons()
    for f in sorted((SRC / "icons").glob("*.svg")):
        if f.stem not in used:
            continue
        svg = f.read_text(encoding="utf-8")
        inner = re.search(r"<svg[^>]*>(.*)</svg>", svg, re.S).group(1)
        out.append('<symbol id="i-%s" viewBox="0 0 256 256">%s</symbol>' % (f.stem, inner.strip()))
    return "\n".join(out)


# ------------------------------------------------------------------ Gyvybės gėlė (skydo simbolis), nubraižyta geometriškai
def rosette_symbols():
    """Ženklas ant EFshield skydų: 37 vienodi apskritimai šešiakampėje gardelėje, apkirpti išoriniu žiedu,
    ir 30 užpildytų žiedlapių aplink septynis centrus. r = 1."""
    e1, e2 = (1.0, 0.0), (0.5, math.sqrt(3) / 2)
    pts = []
    for a in range(-4, 5):
        for b in range(-4, 5):
            x, y = a * e1[0] + b * e2[0], a * e1[1] + b * e2[1]
            if math.hypot(x, y) <= 3.01:
                pts.append((x, y))
    f = lambda v: ("%.3f" % v).rstrip("0").rstrip(".")
    circles = "".join('<circle cx="%s" cy="%s" r="1"/>' % (f(x), f(y)) for x, y in pts)

    def near(p, q, d):
        return abs(math.hypot(p[0] - q[0], p[1] - q[1]) - d) < 1e-6

    core = [p for p in pts if math.hypot(*p) <= 1.01]          # centras + 6 kaimynai
    petals, seen = [], set()
    for u in core:
        for v in pts:
            if near(u, v, 1.0):
                key = tuple(sorted([(round(u[0], 3), round(u[1], 3)), (round(v[0], 3), round(v[1], 3))]))
                if key in seen:
                    continue
                seen.add(key)
                petals.append("M%s %sA1 1 0 0 1 %s %sA1 1 0 0 1 %s %sZ" % (f(u[0]), f(u[1]), f(v[0]), f(v[1]), f(u[0]), f(u[1])))
    full = (
        '<symbol id="rosette" viewBox="-3.3 -3.3 6.6 6.6">'
        '<defs><clipPath id="rosette-clip"><circle r="3"/></clipPath></defs>'
        '<g clip-path="url(#rosette-clip)" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke">%s</g>'
        '<path fill="currentColor" d="%s"/>'
        '<circle r="3.08" fill="none" stroke="currentColor" stroke-width="0.11"/>'
        "</symbol>"
    ) % (circles.replace("<circle ", '<circle vector-effect="non-scaling-stroke" '), "".join(petals))
    # mažas ženkliukas: žiedas + šeši žiedlapiai (skaitomas ir 14 px dydžio)
    mini_petals = []
    for k in range(6):
        v = (math.cos(math.radians(60 * k)), math.sin(math.radians(60 * k)))
        mini_petals.append("M0 0A1 1 0 0 1 %s %sA1 1 0 0 1 0 0Z" % (f(v[0]), f(v[1])))
    mini = (
        '<symbol id="rosette-mini" viewBox="-1.3 -1.3 2.6 2.6">'
        '<path fill="currentColor" d="%s"/>'
        '<circle r="1.14" fill="none" stroke="currentColor" stroke-width="0.12"/>'
        "</symbol>"
    ) % "".join(mini_petals)
    # tik linijos (be užpildytų žiedlapių): fonams
    line = (
        '<symbol id="rosette-line" viewBox="-3.3 -3.3 6.6 6.6">'
        '<g clip-path="url(#rosette-clip)" fill="none" stroke="currentColor" stroke-width="1">%s</g>'
        '<circle r="3.06" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/>'
        "</symbol>"
    ) % circles.replace("<circle ", '<circle vector-effect="non-scaling-stroke" ')
    return full + "\n" + line + "\n" + mini


def sprite():
    return Markup(
        '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">\n%s\n%s\n</svg>'
        % (icon_symbols(), rosette_symbols())
    )


# ------------------------------------------------------------------ hero bangų lankai (nuotraukos koordinatėmis 2048 x 1365)
def hero_arcs():
    """Bangos sklinda nuo maršrutizatoriaus antenų (ox, oy). Skydo kairė sienelė nuotraukoje yra ties x = 672,
    todėl atspindėtos bangos braižomos iš veidrodinio šaltinio (2*672 - ox, oy)."""
    ox, oy, wall = 416.0, 816.0, 672.0

    def arc(cx, cy, r, a1, a2):
        p1 = (cx + r * math.cos(math.radians(a1)), cy + r * math.sin(math.radians(a1)))
        p2 = (cx + r * math.cos(math.radians(a2)), cy + r * math.sin(math.radians(a2)))
        large = 1 if (a2 - a1) % 360 > 180 else 0
        return "M%.1f %.1fA%g %g 0 %d 1 %.1f %.1f" % (p1[0], p1[1], r, r, large, p2[0], p2[1])

    # šeši vienodi lankai: CSS juos išplečia nuo šaltinio skirtingu vėlavimu (kaip radaro žiedai)
    out = [{"d": arc(ox, oy, 900, 74, 286)} for _ in range(6)]
    # trumpi punktyriniai lankai tarp maršrutizatoriaus ir skydo sienelės
    inc = [{"d": arc(ox, oy, r, -28, 28)} for r in (124, 196)]
    return {"out": out, "inc": inc, "ox": ox, "oy": oy, "wall": wall}


# ------------------------------------------------------------------ pagalbiniai filtrai
def price(v):
    return ("%.2f" % float(v)).replace(".", ",") + " €"


def icon(name, cls=""):
    return Markup('<svg class="ico %s" aria-hidden="true" focusable="false"><use href="#i-%s"/></svg>' % (cls, name))


def keep_together(html):
    """„Wi-Fi“ neturi lūžti ties brūkšneliu: teksto mazguose apgaubiama <span class="nb">."""
    out, skip = [], False
    for part in re.split(r"(<[^>]+>)", html):
        if part.startswith("<"):
            low = part.lower()
            if re.match(r"<(title|script|style|textarea)\b", low):
                skip = True
            elif re.match(r"</(title|script|style|textarea)\b", low):
                skip = False
            out.append(part)
        elif skip:
            out.append(part)
        else:
            out.append(re.sub(r"„Wi-Fi“|Wi-Fi", lambda m: '<span class="nb">%s</span>' % m.group(0), part))
    return "".join(out)


def build():
    data = json.loads((SRC / "data" / "site.json").read_text(encoding="utf-8"))
    env = Environment(
        loader=FileSystemLoader(str(SRC / "templates")),
        autoescape=True,
        undefined=StrictUndefined,
        trim_blocks=True,
        lstrip_blocks=True,
    )
    env.filters["price"] = price
    env.globals.update(icon=icon, sprite=sprite(), site=data, hero_arcs=hero_arcs())
    products = {p["id"]: p for p in data["products"]}
    env.globals["products_by_id"] = products
    # duomenys krepšelio scenarijui (assets/js/core.js)
    ef = {
        "products": {p["id"]: {"name": p["name"], "price": p["price"], "img": p["img"], "slug": p["slug"]} for p in data["products"]},
        "colors": {c["id"]: c["label"] for c in data["colors"]},
    }
    env.globals["ef_json"] = Markup(json.dumps(ef, ensure_ascii=False).replace("</", "<\\/"))

    pages = [("index.html", "index.html", {"page": "home"})]
    for p in data["products"]:
        other = [o for o in data["products"] if o["id"] != p["id"]][0]
        faq = [dict(q=i["q"], a=p["faq_place"] if i["a"] == "__PLACE__" else i["a"]) for i in data["faq"]]
        pages.append(("preke.html", p["slug"] + ".html", {"page": "pdp", "product": p, "other": other, "faq": faq}))

    for tpl, out, ctx in pages:
        html = env.get_template(tpl).render(**ctx)
        html = re.sub(r"\n[ \t]*\n(?:[ \t]*\n)+", "\n\n", html)
        html = keep_together(html)
        (ROOT / out).write_text(html, encoding="utf-8")
        print("%-32s %7.1f KB" % (out, len(html.encode("utf-8")) / 1024))


if __name__ == "__main__":
    build()
