import { Category } from '../models/category.model';
import { SubCategory } from '../models/sub-category.model';
import { Item } from '../models/item.model';

export const CATEGORIES: Category[] = [
  { id: 1, nombre: 'pajaro' },
  { id: 2, nombre: 'perro' },
  { id: 3, nombre: 'pez' }
];

export const SUBCATEGORIES: SubCategory[] = [
  { id: 1, nombre: 'items', id_categoria: 1 },
  { id: 2, nombre: 'comida', id_categoria: 1 },
  { id: 3, nombre: 'juguetes', id_categoria: 2 }
];

export const ITEMS: Item[] = [
  { id: 1, nombre: 'comida_pez', precio: 10, id_sub_categoria: 1 },
  { id: 2, nombre: 'juguete_perro', precio: 12, id_sub_categoria: 2 },
  { id: 3, nombre: 'correa_loro', precio: 13, id_sub_categoria: 1 }
];
