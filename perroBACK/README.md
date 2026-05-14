# API simple de Categorías, Subcategorías e Ítems

Esta API sigue el esquema de la imagen con tablas:
- `categorias`
- `sub_categorias`
- `items`

Incluye datos de prueba para mascotas: pájaros, perros, peces, gatos y hamsters.

## Ejecutar

1. Instalar dependencias:

```bash
python -m pip install -r requirements.txt
```

2. Ejecutar el servidor:

```bash
uvicorn main:app --reload
```

3. Abrir la documentación automática:

`http://127.0.0.1:8000/docs`

## Endpoints principales

- `GET /categorias`
- `GET /categorias/{categoria_id}`
- `GET /subcategorias`
- `GET /subcategorias/{subcategoria_id}`
- `GET /subcategorias/por-categoria/{categoria_id}`
- `GET /items`
- `GET /items/{item_id}`
- `GET /items/por-subcategoria/{subcategoria_id}`
