import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductDto } from '../models/catalog.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1/products`;

  getAll(categoryId?: number, query?: string): Observable<ProductDto[]> {
    let params = new HttpParams();

    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }
    if (query) {
      params = params.set('query', query);
    }

    return this.http.get<ProductDto[]>(this.apiUrl, { params });
  }

  create(product: any): Observable<ProductDto> {
    return this.http.post<ProductDto>(this.apiUrl, product);
  }

  update(id: number, product: any): Observable<ProductDto> {
    return this.http.put<ProductDto>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
