import os, re

IMG_DIR = r'public/images/products'
PLACEHOLDER = "'/images/products/card-revelando.png'"

# Explicit manual mapping: product_id -> list of image paths
# (for files whose names don't match the expected slug exactly)
MANUAL = {
    227: ['/images/products/alfachips.jpg'],                         # mini-alfachips
    172: ['/images/products/conito-dulce-de-leche.jpg'],             # conitos de dulce de leche
    138: ['/images/products/nachos-sabor-original-x90gr-ketsal.jpg'],
    191: ['/images/products/nachos-sabor-original-x250gr-ketsal.jpg'],
    190: ['/images/products/nachos-sabor-queso-x70gr-ketsal.jpg'],
    74:  ['/images/products/obleas-santa-maria-ch-frut-coco-limon-vainilla-1.webp',
          '/images/products/obleas-santa-maria-ch-frut-coco-limon-vainilla-2.webp',
          '/images/products/obleas-santa-maria-ch-frut-coco-limon-vainilla-3.webp',
          '/images/products/obleas-santa-maria-ch-frut-coco-limon-vainilla-4.webp'],
    235: ['/images/products/empanadas-espinaca-choclo-x3u-cresfood-1.webp',
          '/images/products/empanadas-espinaca-choclo-x3u-cresfood-2.webp'],
    174: ['/images/products/risotto-al-pesto-hongos-x200gr-mole-1.webp',
          '/images/products/risotto-al-pesto-hongos-x200gr-mole-2.jpg'],
    253: ['/images/products/snack-fugazzeta-bbc-ket-x55g-praat-1.webp',
          '/images/products/snack-fugazzeta-bbc-ket-x55g-praat-2.webp'],
}

# Rename files with spaces
for fname in os.listdir(IMG_DIR):
    if ' ' in fname:
        new = fname.lower().replace(' ', '-')
        os.rename(os.path.join(IMG_DIR, fname), os.path.join(IMG_DIR, new))
        print(f'Renamed: {fname} -> {new}')

# Build slug -> image path mapping from filenames
# (excludes card-revelando and numbered variants -1/-2 since those go via MANUAL)
slug_to_img = {}
for fname in os.listdir(IMG_DIR):
    if fname == 'card-revelando.png':
        continue
    stem = re.sub(r'\.(jpg|jpeg|png|webp)$', '', fname, flags=re.IGNORECASE)
    # skip numbered variants (-1, -2 etc) — handled by MANUAL
    if re.search(r'-[2-9]$', stem):
        continue
    slug_clean = re.sub(r'-1$', '', stem)  # remove trailing -1 for single images
    slug_to_img[slug_clean] = f'/images/products/{fname}'

print(f'\nAuto-mapped slugs ({len(slug_to_img)}):')
for k, v in sorted(slug_to_img.items()):
    print(f'  {k} -> {v}')

# Read products.js
with open('src/data/products.js', encoding='utf-8') as f:
    content = f.read()

# Parse all products
pattern = re.compile(
    r'(\s*\{\s*\n'
    r'\s*id:\s*(\d+),.*?'
    r'\s*slug:\s*\'([^\']+)\'.*?'
    r'\s*images:\s*\[([^\]]*)\],?\s*\n\s*\},)',
    re.DOTALL
)

def build_images_js(paths):
    return '[' + ', '.join(f"'{p}'" for p in paths) + ']'

replaced = 0

def replace_block(m):
    global replaced
    full, pid_str, slug, imgs_str = m.group(1), m.group(2), m.group(3), m.group(4)
    pid = int(pid_str)

    # Skip products that already have real images
    if 'card-revelando' not in imgs_str:
        return full

    # Check MANUAL first
    if pid in MANUAL:
        new_imgs = build_images_js(MANUAL[pid])
        replaced += 1
        return full.replace(f'[{imgs_str}]', new_imgs)

    # Try slug match
    slug_base = re.sub(r'-\d+$', '', slug)  # remove trailing -ID suffix if any
    if slug_base in slug_to_img:
        new_imgs = build_images_js([slug_to_img[slug_base]])
        replaced += 1
        return full.replace(f'[{imgs_str}]', new_imgs)

    return full

new_content = pattern.sub(replace_block, content)

with open('src/data/products.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f'\nActualizados: {replaced} productos con imagen real.')
