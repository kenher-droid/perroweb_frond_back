import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Category } from '../models/category.model';
import { SubCategory } from '../models/sub-category.model';
import { Item } from '../models/item.model';
import { CATEGORIES, SUBCATEGORIES, ITEMS } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:8000'; // FastAPI default port
  private readonly useLocalMock = false; // Ahora usa el backend real

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las categorías
   * Endpoint: GET /categorias
   */
  getCategories(): Observable<Category[]> {
    if (this.useLocalMock) {
      return of(CATEGORIES).pipe(delay(300));
    }
    return this.http.get<Category[]>(`${this.apiUrl}/categorias`);
  }

  /**
   * Obtiene todas las subcategorías
   * Endpoint: GET /subcategorias
   */
  getSubCategories(): Observable<SubCategory[]> {
    if (this.useLocalMock) {
      return of(SUBCATEGORIES).pipe(delay(300));
    }
    return this.http.get<SubCategory[]>(`${this.apiUrl}/subcategorias`);
  }

  /**
   * Obtiene todos los items
   * Endpoint: GET /items
   */
  getItems(): Observable<Item[]> {
    if (this.useLocalMock) {
      return of(ITEMS).pipe(delay(300));
    }
    return this.http.get<Item[]>(`${this.apiUrl}/items`);
  }

  /**
   * Obtiene items por categoría
   * Endpoint: GET /subcategorias/por-categoria/{categoria_id} + GET /items/por-subcategoria/{id}
   */
  getItemsByCategory(categoryId: number): Observable<Item[]> {
    if (this.useLocalMock) {
      const subcategoryIds = SUBCATEGORIES
        .filter((sub) => sub.id_categoria === categoryId)
        .map((sub) => sub.id);
      return of(ITEMS.filter((item) => subcategoryIds.includes(item.id_sub_categoria))).pipe(delay(300));
    }
    // Primero obtener subcategorías de la categoría, luego items de esas subcategorías
    return new Observable((observer) => {
      this.http.get<SubCategory[]>(`${this.apiUrl}/subcategorias/por-categoria/${categoryId}`).subscribe({
        next: (subcategories) => {
          const subcategoryIds = subcategories.map(sub => sub.id);
          // Obtener items de todas las subcategorías
          const itemRequests = subcategoryIds.map(id =>
            this.http.get<Item[]>(`${this.apiUrl}/items/por-subcategoria/${id}`)
          );

          // Combinar todos los resultados
          if (itemRequests.length === 0) {
            observer.next([]);
            observer.complete();
            return;
          }

          let allItems: Item[] = [];
          let completedRequests = 0;

          itemRequests.forEach(request => {
            request.subscribe({
              next: (items) => {
                allItems = allItems.concat(items);
                completedRequests++;
                if (completedRequests === itemRequests.length) {
                  observer.next(allItems);
                  observer.complete();
                }
              },
              error: (error) => observer.error(error)
            });
          });
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Obtiene items por subcategoría
   * Endpoint: GET /items/por-subcategoria/{subcategoria_id}
   */
  getItemsBySubCategory(subCategoryId: number): Observable<Item[]> {
    if (this.useLocalMock) {
      return of(ITEMS.filter((item) => item.id_sub_categoria === subCategoryId)).pipe(delay(300));
    }
    return this.http.get<Item[]>(`${this.apiUrl}/items/por-subcategoria/${subCategoryId}`);
  }

  /**
   * Obtiene un item específico por ID
   * Endpoint: GET /items/{item_id}
   */
  getItemById(id: number): Observable<Item | undefined> {
    if (this.useLocalMock) {
      return of(ITEMS.find((item) => item.id === id)).pipe(delay(300));
    }
    return this.http.get<Item>(`${this.apiUrl}/items/${id}`);
  }

  /**
   * Obtiene subcategorías de una categoría
   * Endpoint: GET /subcategorias/por-categoria/{categoria_id}
   */
  getSubCategoriesByCategory(categoryId: number): Observable<SubCategory[]> {
    if (this.useLocalMock) {
      return of(SUBCATEGORIES.filter((sub) => sub.id_categoria === categoryId)).pipe(delay(300));
    }
    return this.http.get<SubCategory[]>(`${this.apiUrl}/subcategorias/por-categoria/${categoryId}`);
  }
}

