"""Extrae el logo de Gota a favor del tablero de marca y genera PNG transparentes
con colores planos de la paleta + favicons."""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

src = Path(sys.argv[1])
out = Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
im = Image.open(src).convert("RGB")

NAVY = (27, 42, 74)       # token navy #1B2A4A
GOLD = (184, 150, 78)     # token gold #B8964E
IVORY = (247, 243, 233)   # Le Lys del logo #F7F3E9
SCALE = 4


def sample(box):
    a = np.asarray(im.crop(box)).reshape(-1, 3).astype(float)
    return np.median(a, axis=0)


def extract(box, bg_box, inks):
    """inks: lista de (color_muestra_en_imagen, color_de_salida)."""
    crop = im.crop(box)
    crop = crop.resize((crop.width * SCALE, crop.height * SCALE), Image.BICUBIC)
    crop = crop.filter(ImageFilter.MedianFilter(7))
    a = np.asarray(crop).astype(float)
    bg = sample(bg_box)
    best_t = np.zeros(a.shape[:2])
    best_d = np.full(a.shape[:2], np.inf)
    out_rgb = np.zeros(a.shape)
    for ink_sample, ink_out in inks:
        ink = np.asarray(ink_sample, dtype=float)
        v = ink - bg
        # proyección del píxel sobre la recta fondo→tinta
        t = np.clip(((a - bg) @ v) / (v @ v), 0, 1)
        proj = bg + t[..., None] * v
        d = np.linalg.norm(a - proj, axis=-1) + (1 - t) * 0.0
        dist_ink = np.linalg.norm(a - ink, axis=-1)
        pick = d < best_d
        best_d = np.where(pick, d, best_d)
        best_t = np.where(pick, t, best_t)
        out_rgb[pick] = ink_out
    # bordes nítidos pero suavizados
    alpha = np.clip((best_t - 0.35) / 0.30, 0, 1)
    alpha = alpha * alpha * (3 - 2 * alpha)
    rgba = np.dstack([out_rgb, alpha * 255]).astype(np.uint8)
    img = Image.fromarray(rgba, "RGBA")
    # quita motas pequeñas: bbox sobre alfa fuerte
    strong = Image.fromarray((alpha > 0.5).astype(np.uint8) * 255).filter(ImageFilter.MinFilter(5))
    return img.crop(strong.getbbox())


def pad_square(img, pad_ratio=0.0):
    w, h = img.size
    side = int(max(w, h) * (1 + pad_ratio))
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - w) // 2, (side - h) // 2), img)
    return canvas


def fit_w(img, w):
    return img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)


# muestras de color en la imagen original
def cluster(box, cond):
    a = np.asarray(im.crop(box)).reshape(-1, 3).astype(float)
    return np.median(a[cond(a)], axis=0)


lum = lambda a: a @ np.array([0.299, 0.587, 0.114])
warm = lambda a: (a[:, 0] - a[:, 2] > 60) & (lum(a) > 90)
navy_ink = cluster((140, 70, 715, 410), lambda a: lum(a) < 70)
gold_ink = cluster((140, 70, 715, 410), warm)
ivory_ink = cluster((860, 165, 1500, 320), lambda a: lum(a) > 215)
gold_ink_dark = cluster((860, 165, 1500, 320), warm)
BG_LIGHT = (40, 40, 120, 60)
BG_DARK = (1300, 60, 1400, 120)
print("muestras", navy_ink, gold_ink, ivory_ink, gold_ink_dark)

mark = extract((315, 70, 505, 280), BG_LIGHT, [(navy_ink, NAVY), (gold_ink, GOLD)])
pad_square(mark, 0.04).resize((512, 512), Image.LANCZOS).save(out / "logo-mark.png", optimize=True)

mark_light = extract((865, 165, 1010, 322), BG_DARK, [(ivory_ink, IVORY), (gold_ink_dark, GOLD)])
pad_square(mark_light, 0.04).resize((512, 512), Image.LANCZOS).save(out / "logo-mark-light.png", optimize=True)

lock = extract((140, 70, 715, 410), BG_LIGHT, [(navy_ink, NAVY), (gold_ink, GOLD)])
fit_w(lock, 1200).save(out / "logo-lockup.png", optimize=True)

lock_h = extract((860, 165, 1500, 320), BG_DARK, [(ivory_ink, IVORY), (gold_ink_dark, GOLD)])
fit_w(lock_h, 1200).save(out / "logo-lockup-light.png", optimize=True)


def app_icon(size, radius_ratio=0.22, inner=0.66):
    base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(base).rounded_rectangle(
        (0, 0, size - 1, size - 1), radius=int(size * radius_ratio), fill=NAVY + (255,)
    )
    m = pad_square(mark_light).resize((int(size * inner), int(size * inner)), Image.LANCZOS)
    base.paste(m, ((size - m.width) // 2, (size - m.height) // 2), m)
    return base


app_icon(512).save(out / "icon.png", optimize=True)
app_icon(180, radius_ratio=0.0).save(out / "apple-icon.png", optimize=True)
app_icon(256, inner=0.78).save(out / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print("ok", mark.size, mark_light.size, lock.size, lock_h.size)
