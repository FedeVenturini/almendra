import re
import pandas as pd

with open('src/data/products.js', encoding='utf-8') as f:
    content = f.read()

rows = []
blocks = re.findall(r'\{[^{}]+\}', content, re.DOTALL)
for block in blocks:
    if 'card-revelando' not in block:
        continue
    id_m    = re.search(r'id: (\d+)', block)
    name_m  = re.search(r"name: '([^']+)'", block)
    slug_m  = re.search(r"slug: '([^']+)'", block)
    brand_m = re.search(r"brand: '([^']+)'", block)
    if not (id_m and name_m and slug_m and brand_m):
        continue

    pid   = int(id_m.group(1))
    name  = name_m.group(1)
    slug  = re.sub(r'-\d+$', '', slug_m.group(1))
    brand = 'Almendra' if brand_m.group(1) == 'almendra' else 'Otras marcas'
    img   = slug + '.jpg'

    rows.append({'ID': pid, 'Nombre del producto': name, 'Nombre del archivo': img, 'Marca': brand})

df = pd.DataFrame(rows).sort_values('ID').reset_index(drop=True)

out = r'C:\Users\FedericoVenturini\Documents\Proyectos\almendra\imagenes-faltantes.xlsx'
with pd.ExcelWriter(out, engine='openpyxl') as writer:
    df.to_excel(writer, index=False, sheet_name='Imágenes faltantes')
    ws = writer.sheets['Imágenes faltantes']
    ws.column_dimensions['A'].width = 6
    ws.column_dimensions['B'].width = 45
    ws.column_dimensions['C'].width = 55
    ws.column_dimensions['D'].width = 14

print(f'Generado: {len(df)} productos - imagenes-faltantes.xlsx')
