import pandas as pd
import re

path = r'C:\Users\FedericoVenturini\OneDrive - Gaviglio Comercial S.A\Escritorio\Categorias.xlsx'
df = pd.read_excel(path, header=0)
df.columns = ['erpId', 'erpName', 'group', 'category', 'brand', 'cliente', 'clientes2']
df['erpId'] = df['erpId'].astype(str).str.zfill(5)

cat_slug = {
    'Alfajores': 'alfajores',
    'Budines': 'budines',
    'Postres': 'postres',
    'Galletitas': 'galletitas',
    'Porciones': 'porciones',
    'Torta': 'torta',
    'Panadería': 'panaderia',
    'Panaderia': 'panaderia',
    'A granel': 'a-granel',
    'Frutos secos': 'frutos-secos',
    'Pastas': 'pastas',
    'Galletas': 'galletas',
    'Frezzados': 'frezzados',
    'Snacks': 'snacks',
    'Fiambre': 'fiambre',
    'nan': 'otros',
}

existing = {
  '00098': (1,'Alfajor de Chocolate','alfajor-chocolate','Elaborado con cacao de primera calidad y relleno generoso de dulce de leche artesanal. Cubierto con baño de chocolate blanco o negro que se derrite en cada mordida.',['/images/products/alfajor-chocolate-1.jpg','/images/products/alfajor-chocolate-2.jpg','/images/products/alfajor-chocolate-3.jpg']),
  '00099': (2,'Alfajor de Maicena','alfajor-maicena','Clásico alfajor de maicena con tapas tiernas y suaves, rellenas de dulce de leche casero y rebozadas en coco rallado. Una receta que no falla.',['/images/placeholder.jpg']),
  '00415': (3,'Cookies NY con Chips','cookies-ny','Inspiradas en las famosas cookies de Nueva York: grandes, con mucho chocolate y un centro suave que se deshace. Para los que no se conforman con poco. x4 unidades.',['/images/products/cookies-ny.jpg']),
  '00430': (4,'Cookies de Avena, Miel y Frutos Secos','cookies-avena-miel','Cookies con avena entera sin gluten, miel natural y mix de frutos secos. Más livianas que las clásicas, con un sabor cálido y reconfortante. x4 unidades.',['/images/products/cookies-miel-avena-1.jpg','/images/products/cookies-miel-avena-2.jpg']),
  '00212': (5,'Bombón de Avena Sin Gluten','bombon-de-avena','Bocaditos de avena sin gluten con un toque dulce y textura irresistible. Ideales para merendar o regalar. x6 unidades.',['/images/placeholder.jpg']),
  '00332': (6,'Turron de Avena Sin Gluten','turron-de-avena','Porción individual de turrón artesanal de avena sin gluten. Dulce, consistente y perfecta para picar entre comidas. Aprox. 100gr.',['/images/placeholder.jpg']),
  '00216': (7,'Granola Casera Sin Lacteos','granola-casera','Granola artesanal de avena sin gluten con mix de frutos secos, pasas, coco y maní, endulzada con miel. Sin lacteos. x200gr.',['/images/placeholder.jpg']),
  '00417': (8,'Polvorones Limón/Naranja','polvorones','Polvorones artesanales con toque cítrico de limón o naranja. De textura arenosa y sabor suave, se deshacen en la boca. x200gr.',['/images/placeholder.jpg']),
  '00092': (9,'Budín de Chips','budin-chips','Budín esponjoso con chips de chocolate distribuidos en cada porción. Húmedo, dulce y perfecto para el desayuno o la merienda. x400gr.',['/images/placeholder.jpg']),
  '00093': (10,'Budín Cítrico Sin Lacteos','budin-citrico','Budín con aroma y sabor a cítricos naturales. Esponjoso, fresco y sin lacteos. Ideal para quienes prefieren algo más liviano. x400gr.',['/images/placeholder.jpg']),
  '00578': (11,'Budín de Coco Sin Lacteos','budin-coco','Budín húmedo con coco rallado que aporta textura y un sabor tropical suave. Sin lacteos y perfecto para toda la familia. x400gr.',['/images/placeholder.jpg']),
  '00408': (12,'Brownie Tortita Individual','brownie-tortita','Brownie individual de chocolate intenso con textura húmeda y densa. Para los amantes del chocolate puro.',['/images/placeholder.jpg']),
  '00445': (13,'Brownie Porción Individual','brownie-porcion','Porción generosa de brownie de chocolate artesanal. Fudgy por dentro y con costra crocante por fuera.',['/images/placeholder.jpg']),
  '00442': (14,'Lemon Pie Individual Sin Lacteos','lemon-pie','Postre individual con base crujiente, crema de limón ácida y merengue dorado. Sin lacteos y con todo el sabor de siempre.',['/images/placeholder.jpg']),
  '00133': (15,'Tartita de Coco y Dulce de Leche','tartita-coco-ddl','Tartita con base crocante de coco y corazón de dulce de leche cremoso. Un postre que combina texturas y sabores en cada bocado.',['/images/placeholder.jpg']),
  '00123': (16,'Pastafrolita Individual','pastafrolita','Pasta frola individual de masa tierna con dulce de membrillo o batata. El clásico de los domingos en versión personal.',['/images/placeholder.jpg']),
  '00786': (17,'Postre Oreo Individual','postre-oreo','Postre cremoso con base de galletitas estilo Oreo y mousse de chocolate. Frío, suave y adictivo.',['/images/placeholder.jpg']),
  '00787': (18,'Postre Chocolina Individual','postre-chocolina','Postre en capas con crema y galletitas de chocolate. El sabor de los domingos en casa en una porción individual.',['/images/placeholder.jpg']),
  '00791': (19,'Postre Cheesecake Individual','postre-cheesecake','Cheesecake cremoso con base crocante y topping de frutos rojos o dulce de leche. Una delicia que no necesita horno.',['/images/placeholder.jpg']),
  '00804': (20,'Medialunas','medialunas','Medialunas artesanales de manteca, tiernas y hojaldradas. Perfectas para el desayuno o la merienda con una taza de café. x2 unidades.',['/images/placeholder.jpg']),
  '00124': (21,'Pepas','pepas','Galletitas de masa tierna rellenas de membrillo casero. Un clásico de la panadería argentina que evoca sabores de siempre. x200gr.',['/images/products/pepas.jpg']),
  '00119': (22,'Pan de Molde Sin Lacteos','pan-de-molde','Pan de molde artesanal de miga esponjosa y corteza suave. Sin lacteos, sin conservantes ni aditivos. Perfecto para el desayuno o la merienda.',['/images/products/pan-lactal-1.jpg','/images/products/pan-lactal-2.jpg']),
  '00120': (23,'Pan de Molde Integral Sin Lacteos','pan-de-molde-integral','Pan de molde integral de 900gr a 1kg. Rico en fibra, con sabor más profundo y sin lacteos. Ideal para quienes buscan una opción más nutritiva.',['/images/products/pan-lactal-integral.jpg']),
  '00117': (24,'Pan Bollito Sin Lacteos','pan-bollito','Pancitos artesanales tiernos y esponjosos, sin lacteos. Ideales para el desayuno, para la vianda o para acompañar cualquier comida. x4 unidades.',['/images/placeholder.jpg']),
  '00231': (25,'Rapiditas Sin Lacteos','rapiditas','Panes planos rápidos, sin lacteos y muy versátiles. Perfectos para hacer wraps, tacos o simplemente para acompañar. x6 unidades.',['/images/placeholder.jpg']),
  '00671': (26,'Rapiditas Integrales Sin Lacteos','rapiditas-integrales','Versión integral de nuestras rapiditas. Más fibra, mismo sabor artesanal. Sin lacteos. x6 unidades.',['/images/placeholder.jpg']),
  '00254': (27,'Pan de Hamburguesa Sin Lacteos','pan-hamburguesa','Pan de hamburguesa esponjoso y con la estructura justa para aguantar todos los ingredientes. Sin lacteos. x2 unidades.',['/images/placeholder.jpg']),
  '00287': (28,'Pan de Pancho/Pebete Sin Lacteos','pan-pancho-pebete','Panes largos y tiernos para panchos o pebetes. Sin lacteos y con la textura perfecta para rellenar como más te guste. x4 unidades.',['/images/placeholder.jpg']),
  '00268': (29,'Pionono Sin Lacteos','pionono','Pionono artesanal suave y flexible, ideal para rellenar con lo que quieras: dulce de leche, crema, fiambres o vegetales. Sin lacteos.',['/images/placeholder.jpg']),
  '00709': (30,'Sandwich Integral','sandwich-integral','Sandwich en pan integral artesanal sin TACC. Relleno con ingredientes frescos y de calidad. x1 unidad.',['/images/placeholder.jpg']),
  '00710': (31,'Sandwich de Miga Jamón y Queso','sandwich-miga-jyq','Sandwich de miga clásico con jamón y queso, en pan artesanal sin TACC. Suave, fresco y listo para comer. x1 unidad.',['/images/placeholder.jpg']),
  '00389': (32,'Chipa Extra Queso — Crudo Freezado','chipa-extra-queso','Chipa con doble de queso, para hornear en casa. Crocante por fuera, filante por dentro. Se conserva en el freezer hasta el momento de usar. x250gr.',['/images/products/chipa-frezado-1.jpg','/images/products/chipa-frezado-2.jpg']),
  '00692': (33,'Chipa Roquefort — Crudo Freezado','chipa-roquefort','Chipa con roquefort para los amantes del queso azul. Intenso, crocante y adictivo. Para hornear en casa desde el freezer. x250gr.',['/images/placeholder.jpg']),
  '00754': (34,'Chipa Cocido','chipa-cocido','Chipa ya cocido, listo para comer. De almidón de mandioca con queso, crocante por fuera y tierno por dentro. El clásico de siempre. x100gr.',['/images/placeholder.jpg']),
  '00096': (35,'Canelones de Verduras Sin Lacteos','canelones-verduras','Canelones rellenos de verduras frescas, sin lacteos. Artesanales, sabrosos y perfectos para una comida completa. x3 unidades.',['/images/placeholder.jpg']),
  '00107': (36,'Tallarines Sin Lacteos','tallarines','Tallarines artesanales sin TACC y sin lacteos. De textura firme al dente, ideales para acompañar cualquier salsa. x500gr.',['/images/placeholder.jpg']),
  '00168': (37,'Ravioles de Hongos y Ricota','ravioles-hongos-ricota','Ravioles rellenos de hongos y ricota. Sabor intenso, textura suave. 16 unidades, 2 porciones, aprox. 550gr.',['/images/placeholder.jpg']),
  '00169': (38,'Ravioles de Espinaca Sin Lacteos','ravioles-espinaca','Ravioles de masa verde con relleno de espinaca, sin lacteos. Livianos y sabrosos. 16 unidades, 2 porciones, aprox. 550gr.',['/images/placeholder.jpg']),
  '00170': (39,'Ravioles de Jamón y Muzzarella','ravioles-jamon-muzzarella','Ravioles rellenos de jamón y muzzarella fundidos. Un clásico que gusta a todos. 16 unidades, 2 porciones, aprox. 550gr.',['/images/placeholder.jpg']),
  '00172': (40,'Ravioles de Espinaca y Ricota','ravioles-espinaca-ricota','Ravioles con relleno de espinaca y ricota cremosa. Suaves, nutritivos y deliciosos con manteca y salvia. 16 unidades, 2 porciones, aprox. 550gr.',['/images/placeholder.jpg']),
  '00185': (41,'Prepizzetas Sin Lacteos','prepizzetas','Bases de pizza artesanales para terminar a tu gusto en casa. Sin lacteos, crocantes y con la textura perfecta. x2 unidades.',['/images/placeholder.jpg']),
  '00199': (42,'Pizza Casera Muzzarella','pizza-muzzarella','Pizza artesanal con abundante muzzarella derretida sobre salsa de tomate casera. Sencilla, clásica e irresistible.',['/images/placeholder.jpg']),
  '00202': (43,'Pizza Casera Napolitana','pizza-napolitana','Pizza artesanal con muzzarella, rodajas de tomate fresco y albahaca. El sabor italiano de siempre en versión sin TACC.',['/images/placeholder.jpg']),
  '00303': (44,'Pizza Casera Muzzarella y Roquefort','pizza-muzzarella-roquefort','Pizza con la combinación ganadora de muzzarella suave y roquefort intenso. Para los que se animan a algo diferente.',['/images/placeholder.jpg']),
  '00304': (45,'Pizza Casera Muzzarella y Jamón','pizza-muzzarella-jamon','Pizza clásica con muzzarella y jamón cocido de calidad. Equilibrada, sabrosa y perfecta para compartir.',['/images/placeholder.jpg']),
  '00312': (46,'Tarta Casera Espinaca y Queso','tarta-espinaca-queso','Tarta artesanal de espinaca fresca y queso cremoso. Ideal para el almuerzo o la cena, sola o con ensalada. 250gr.',['/images/placeholder.jpg']),
  '00313': (47,'Tarta Casera Mix de Verduras Sin Lacteos','tarta-mix-verduras','Tarta de verduras variadas, sin lacteos. Nutritiva, colorida y llena de sabor. 240gr.',['/images/placeholder.jpg']),
  '00314': (48,'Tarta Casera Choclo, Cebolla y Queso','tarta-choclo-cebolla-queso','Tarta artesanal con relleno dulzón de choclo, cebolla caramelizada y queso fundido. Un clásico que no falla. 250gr.',['/images/placeholder.jpg']),
  '00406': (49,'Tarta Casera Jamón y Muzzarella','tarta-jamon-muzzarella','Tarta con relleno generoso de jamón y muzzarella derretida. Perfecta para el almuerzo o como entrada. 250gr.',['/images/placeholder.jpg']),
  '00128': (50,'Tapas de Empanadas Sin Lacteos','tapas-empanadas','Tapas de empanadas artesanales sin TACC y sin lacteos. De masa suave y resistente para rellenar con lo que más te guste. x12 unidades.',['/images/placeholder.jpg']),
  '00129': (51,'Tapas de Tarta Sin Lacteos','tapas-de-tarta','Tapas de tarta artesanales sin TACC y sin lacteos. Listas para rellenar y hornear. x2 unidades.',['/images/placeholder.jpg']),
  '00130': (52,'Tapas de Tarta Integral Sin Lacteos','tapas-tarta-integral','Tapas de tarta integrales sin TACC y sin lacteos. Más fibra y sabor, perfectas para una opción más nutritiva. x2 unidades.',['/images/placeholder.jpg']),
  '00105': (53,'Marineras Sin Lacteos','marineras','Galletitas saladas de masa hojaldrada, sin lacteos. Ideales para acompañar fiambres, quesos o simplemente solas. Un clásico de panadería. x200gr.',['/images/products/marineras.jpg']),
  '00106': (54,'Marineras con Semillas Sin Lacteos','marineras-semillas','Marineras con mix de semillas para más textura y nutrientes. Sin lacteos y perfectas para una picada saludable. x200gr.',['/images/products/marineras-integral.jpg']),
  '00126': (55,'Talitas','talitas','Galletitas de campo con manteca y un toque dulce muy justo. Crocantes, livianas y perfectas para acompañar el mate de la tarde. x200gr.',['/images/products/talitas.jpg']),
  '00127': (56,'Talitas Integrales','talitas-integrales','La versión integral de nuestra talita de siempre. Con harina integral y semillas, para un snack más completo sin perder el sabor artesanal. x200gr.',['/images/products/talitas-integral.jpg']),
}

def slugify(s):
    s = s.lower()
    for src, dst in [('á','a'),('à','a'),('ä','a'),('é','e'),('è','e'),('ë','e'),
                     ('í','i'),('ì','i'),('ï','i'),('ó','o'),('ò','o'),('ö','o'),
                     ('ú','u'),('ù','u'),('ü','u'),('ñ','n'),('ç','c')]:
        s = s.replace(src, dst)
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')[:50]

def js_str(s):
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', ' ')

lines = []
lines.append("export const categories = [")
lines.append("  { id: 'todos',        label: 'Todos' },")
lines.append("  // Dulce")
lines.append("  { id: 'alfajores',    label: 'Alfajores' },")
lines.append("  { id: 'budines',      label: 'Budines' },")
lines.append("  { id: 'galletitas',   label: 'Galletitas' },")
lines.append("  { id: 'postres',      label: 'Postres' },")
lines.append("  { id: 'porciones',    label: 'Porciones' },")
lines.append("  { id: 'torta',        label: 'Tortas' },")
lines.append("  // Dulce y Salado")
lines.append("  { id: 'panaderia',    label: 'Panadería' },")
lines.append("  { id: 'a-granel',     label: 'A granel' },")
lines.append("  { id: 'frutos-secos', label: 'Frutos secos' },")
lines.append("  // Salado")
lines.append("  { id: 'pastas',       label: 'Pastas' },")
lines.append("  { id: 'galletas',     label: 'Galletas' },")
lines.append("  { id: 'frezzados',    label: 'Frezzados' },")
lines.append("  { id: 'snacks',       label: 'Snacks' },")
lines.append("  { id: 'fiambre',      label: 'Fiambre' },")
lines.append("  { id: 'otros',        label: 'Otros' },")
lines.append("];")
lines.append("")
lines.append("export const products = [")

next_id = 57
for _, row in df.iterrows():
    erpId = row['erpId']
    erpName = str(row['erpName']).strip()
    grp = str(row['group']).strip()
    cat_raw = str(row['category']).strip()
    brand_raw = str(row['brand']).strip()
    clientes2 = str(row['clientes2']).strip()

    cat = cat_slug.get(cat_raw, 'otros')
    group = 'dulce' if grp == 'Dulce' else 'salado'
    brand = 'almendra' if brand_raw == 'Almendra' else 'otras'
    wholesale_visible = 'true' if clientes2 == 'Mayorista' else 'false'

    if erpId in existing:
        pid, name, slug, desc, images = existing[erpId]
        images_js = '[' + ', '.join(f"'{i}'" for i in images) + ']'
    else:
        pid = next_id
        next_id += 1
        # Title case but preserve x200gr-style parts
        name = erpName.title()
        slug = slugify(erpName) + f'-{pid}'
        desc = ''
        images_js = "['/images/placeholder.jpg']"

    lines.append("  {")
    lines.append(f"    id: {pid},")
    lines.append(f"    erpId: '{js_str(erpId)}',")
    lines.append(f"    erpName: '{js_str(erpName)}',")
    lines.append(f"    name: '{js_str(name)}',")
    lines.append(f"    slug: '{js_str(slug)}',")
    lines.append(f"    group: '{group}',")
    lines.append(f"    category: '{cat}',")
    lines.append(f"    brand: '{brand}',")
    lines.append(f"    wholesaleVisible: {wholesale_visible},")
    lines.append(f"    description: '{js_str(desc)}',")
    lines.append(f"    images: {images_js},")
    lines.append("  },")

lines.append("];")

output = '\n'.join(lines)
with open(r'C:\Users\FedericoVenturini\Documents\Proyectos\almendra\src\data\products.js', 'w', encoding='utf-8') as f:
    f.write(output)
print(f'Done! Total products: {next_id - 1}')
