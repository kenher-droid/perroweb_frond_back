from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Float, ForeignKey, create_engine, select
from sqlalchemy.orm import declarative_base, relationship, Session
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATABASE_URL = f"sqlite:///{BASE_DIR / 'database.db'}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
Base = declarative_base()

class CategoriaModel(Base):
    __tablename__ = 'categorias'
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    subcategorias = relationship('SubCategoriaModel', back_populates='categoria')

class SubCategoriaModel(Base):
    __tablename__ = 'sub_categorias'
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    id_categoria = Column(Integer, ForeignKey('categorias.id'), nullable=False)
    categoria = relationship('CategoriaModel', back_populates='subcategorias')
    items = relationship('ItemModel', back_populates='subcategoria')

class ItemModel(Base):
    __tablename__ = 'items'
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    precio = Column(Float, nullable=False)
    id_sub_categoria = Column(Integer, ForeignKey('sub_categorias.id'), nullable=False)
    subcategoria = relationship('SubCategoriaModel', back_populates='items')

class Categoria(BaseModel):
    id: int
    nombre: str
    class Config:
        from_attributes = True

class SubCategoria(BaseModel):
    id: int
    nombre: str
    id_categoria: int
    class Config:
        from_attributes = True

class Item(BaseModel):
    id: int
    nombre: str
    precio: float
    id_sub_categoria: int
    class Config:
        from_attributes = True

from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        if session.scalars(select(CategoriaModel)).first() is None:
            categorias = [
                CategoriaModel(id=1, nombre='pajaro'),
                CategoriaModel(id=2, nombre='perro'),
                CategoriaModel(id=3, nombre='pez'),
                CategoriaModel(id=4, nombre='gato'),
                CategoriaModel(id=5, nombre='hamster'),
            ]
            subcategorias = [
                SubCategoriaModel(id=1, nombre='items', id_categoria=1),
                SubCategoriaModel(id=2, nombre='comida', id_categoria=1),
                SubCategoriaModel(id=3, nombre='juguetes', id_categoria=2),
                SubCategoriaModel(id=4, nombre='accesorios', id_categoria=2),
                SubCategoriaModel(id=5, nombre='higiene', id_categoria=2),
                SubCategoriaModel(id=6, nombre='comida', id_categoria=3),
                SubCategoriaModel(id=7, nombre='accesorios', id_categoria=3),
                SubCategoriaModel(id=8, nombre='juguetes', id_categoria=4),
                SubCategoriaModel(id=9, nombre='comida', id_categoria=4),
                SubCategoriaModel(id=10, nombre='accesorios', id_categoria=5),
                SubCategoriaModel(id=11, nombre='comida', id_categoria=5),
            ]
            items = [
                ItemModel(id=1, nombre='comida_pez', precio=10.50, id_sub_categoria=1),
                ItemModel(id=2, nombre='juguete_perro', precio=12.99, id_sub_categoria=3),
                ItemModel(id=3, nombre='correa_loro', precio=13.75, id_sub_categoria=1),
                ItemModel(id=4, nombre='semillas_pajaro', precio=8.25, id_sub_categoria=2),
                ItemModel(id=5, nombre='pelota_perro', precio=15.00, id_sub_categoria=3),
                ItemModel(id=6, nombre='collar_perro', precio=20.50, id_sub_categoria=4),
                ItemModel(id=7, nombre='shampoo_perro', precio=18.99, id_sub_categoria=5),
                ItemModel(id=8, nombre='alimento_pez', precio=12.00, id_sub_categoria=6),
                ItemModel(id=9, nombre='filtro_acuario', precio=45.00, id_sub_categoria=7),
                ItemModel(id=10, nombre='raton_gato', precio=5.99, id_sub_categoria=8),
                ItemModel(id=11, nombre='atun_gato', precio=9.50, id_sub_categoria=9),
                ItemModel(id=12, nombre='jaula_hamster', precio=30.00, id_sub_categoria=10),
                ItemModel(id=13, nombre='pellets_hamster', precio=7.25, id_sub_categoria=11),
                ItemModel(id=14, nombre='rueda_ejercicio', precio=22.99, id_sub_categoria=10),
                ItemModel(id=15, nombre='heno_hamster', precio=6.50, id_sub_categoria=11),
            ]
            session.add_all(categorias + subcategorias + items)
            session.commit()
    yield
    # Shutdown (opcional)

app = FastAPI(title='API de Categorías y Items', lifespan=lifespan)

@app.get('/categorias', response_model=list[Categoria])
def listar_categorias():
    with Session(engine) as session:
        return session.scalars(select(CategoriaModel)).all()

@app.get('/categorias/{categoria_id}', response_model=Categoria)
def obtener_categoria(categoria_id: int):
    with Session(engine) as session:
        categoria = session.get(CategoriaModel, categoria_id)
        if not categoria:
            raise HTTPException(status_code=404, detail='Categoría no encontrada')
        return categoria

@app.get('/subcategorias', response_model=list[SubCategoria])
def listar_subcategorias():
    with Session(engine) as session:
        return session.scalars(select(SubCategoriaModel)).all()

@app.get('/subcategorias/{subcategoria_id}', response_model=SubCategoria)
def obtener_subcategoria(subcategoria_id: int):
    with Session(engine) as session:
        subcategoria = session.get(SubCategoriaModel, subcategoria_id)
        if not subcategoria:
            raise HTTPException(status_code=404, detail='Subcategoría no encontrada')
        return subcategoria

@app.get('/subcategorias/por-categoria/{categoria_id}', response_model=list[SubCategoria])
def listar_subcategorias_por_categoria(categoria_id: int):
    with Session(engine) as session:
        return session.scalars(select(SubCategoriaModel).where(SubCategoriaModel.id_categoria == categoria_id)).all()

@app.get('/items', response_model=list[Item])
def listar_items():
    with Session(engine) as session:
        return session.scalars(select(ItemModel)).all()

@app.get('/items/{item_id}', response_model=Item)
def obtener_item(item_id: int):
    with Session(engine) as session:
        item = session.get(ItemModel, item_id)
        if not item:
            raise HTTPException(status_code=404, detail='Item no encontrado')
        return item

@app.get('/items/por-subcategoria/{subcategoria_id}', response_model=list[Item])
def listar_items_por_subcategoria(subcategoria_id: int):
    with Session(engine) as session:
        return session.scalars(select(ItemModel).where(ItemModel.id_sub_categoria == subcategoria_id)).all()
