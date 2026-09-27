"""Vectoriza la marca de Gota a favor (gota navy + punto dorado) a SVG.

Recorta la marca de la imagen de la propuesta 3, la amplía, separa tinta navy y
dorada, traza los contornos con contourpy y los suaviza como curvas Bézier.
El punto dorado se ajusta como un círculo perfecto.
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage
import contourpy

src, out_svg = sys.argv[1], sys.argv[2]
NAVY_OUT = sys.argv[3] if len(sys.argv) > 3 else "#13294B"
GOLD_OUT = sys.argv[4] if len(sys.argv) > 4 else "#C29A5B"

im = Image.open(src).convert("RGB")
box = (95, 85, 215, 225)  # región de la marca en la imagen de 537×312
crop = im.crop(box)
S = 8
big = crop.resize((crop.width * S, crop.height * S), Image.BICUBIC)
a = np.asarray(big).astype(float)

bg = np.array([245, 244, 241.0])
navy = np.median(a.reshape(-1, 3)[(a.reshape(-1, 3) @ [0.299, 0.587, 0.114]) < 70], axis=0)
warm = a.reshape(-1, 3)
gold = np.median(warm[(warm[:, 0] - warm[:, 2] > 60) & (warm @ [0.299, 0.587, 0.114] > 110)], axis=0)
print("navy", navy.round(), "gold", gold.round())


def score(ink):
    v = ink - bg
    t = np.clip(((a - bg) @ v) / (v @ v), 0, 1)
    resid = np.linalg.norm(a - (bg + t[..., None] * v), axis=-1)
    return t, resid


t_n, r_n = score(navy)
t_g, r_g = score(gold)
navy_field = np.where(r_n <= r_g, t_n, 0)
gold_field = np.where(r_g < r_n, t_g, 0)
navy_field = ndimage.gaussian_filter(navy_field, sigma=S * 0.7)
gold_field = ndimage.gaussian_filter(gold_field, sigma=S * 0.7)


def contornos(field, nivel=0.5, area_min=2000):
    gen = contourpy.contour_generator(z=field, line_type="Separate")
    lineas = gen.lines(nivel)
    res = []
    for l in lineas:
        if len(l) < 20:
            continue
        x, y = l[:, 0], l[:, 1]
        area = 0.5 * abs(np.dot(x, np.roll(y, 1)) - np.dot(y, np.roll(x, 1)))
        if area > area_min:
            res.append(l)
    return res


def suavizar_cerrado(p, n=90, sigma=3.0):
    # remuestrea a longitud de arco uniforme y suaviza en forma circular
    if np.allclose(p[0], p[-1]):
        p = p[:-1]
    d = np.sqrt((np.diff(np.vstack([p, p[:1]]), axis=0) ** 2).sum(1))
    s = np.concatenate([[0], np.cumsum(d)])
    total = s[-1]
    u = np.linspace(0, total, 600, endpoint=False)
    pc = np.vstack([p, p[:1]])
    x = np.interp(u, s, pc[:, 0])
    y = np.interp(u, s, pc[:, 1])
    x = ndimage.gaussian_filter1d(x, sigma, mode="wrap")
    y = ndimage.gaussian_filter1d(y, sigma, mode="wrap")
    # conserva más puntos donde la curvatura es alta (las puntas de la gota)
    dx, dy = np.gradient(x), np.gradient(y)
    ddx, ddy = np.gradient(dx), np.gradient(dy)
    k = np.abs(dx * ddy - dy * ddx) / np.power(dx * dx + dy * dy, 1.5)
    peso = 1 + 25 * k / (k.max() + 1e-9)
    acc = np.cumsum(peso)
    objetivo = np.linspace(0, acc[-1], n, endpoint=False)
    idx = np.searchsorted(acc, objetivo).clip(0, len(x) - 1)
    return np.column_stack([x[idx], y[idx]])


def catmull_a_bezier(pts):
    n = len(pts)
    seg = []
    for i in range(n):
        p0, p1, p2, p3 = pts[(i - 1) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]
        c1 = p1 + (p2 - p0) / 6
        c2 = p2 - (p3 - p1) / 6
        seg.append((c1, c2, p2))
    return seg


navys = contornos(navy_field)
golds = contornos(gold_field)
print("formas navy:", len(navys), "doradas:", len(golds))

# encuadre común
todos = np.vstack(navys + golds)
minx, miny = todos.min(0)
maxx, maxy = todos.max(0)
lado = max(maxx - minx, maxy - miny)
pad = lado * 0.04
VB = 100.0
esc = VB / (lado + 2 * pad)
ox = (lado - (maxx - minx)) / 2 + pad - minx
oy = (lado - (maxy - miny)) / 2 + pad - miny
tf = lambda p: (p + [ox, oy]) * esc

fmt = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")
paths = []
for l in navys:
    pts = tf(suavizar_cerrado(l))
    d = f"M{fmt(pts[0][0])} {fmt(pts[0][1])}"
    for c1, c2, p in catmull_a_bezier(pts):
        d += f"C{fmt(c1[0])} {fmt(c1[1])} {fmt(c2[0])} {fmt(c2[1])} {fmt(p[0])} {fmt(p[1])}"
    paths.append(d + "Z")

g = max(golds, key=len)
gp = tf(g)
gx, gy = gp[:, 0], gp[:, 1]
area = 0.5 * abs(np.dot(gx, np.roll(gy, 1)) - np.dot(gy, np.roll(gx, 1)))
cx, cy = gx.mean(), gy.mean()
r = np.sqrt(area / np.pi)

svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {int(VB)} {int(VB)}">'
    f'<path fill="{NAVY_OUT}" d="{" ".join(paths)}"/>'
    f'<circle fill="{GOLD_OUT}" cx="{fmt(cx)}" cy="{fmt(cy)}" r="{fmt(r)}"/></svg>'
)
open(out_svg, "w", encoding="utf-8").write(svg)
print("ok", len(svg), "bytes; círculo", fmt(cx), fmt(cy), fmt(r))
