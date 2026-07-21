with open('src/data/products.js', encoding='utf-8') as f:
    content = f.read()
content = content.replace("'/images/placeholder.jpg'", "'/images/products/card-revelando.png'")
with open('src/data/products.js', 'w', encoding='utf-8') as f:
    f.write(content)
idx = content.find('panaderia')
print('OK:', repr(content[idx:idx+50]))
