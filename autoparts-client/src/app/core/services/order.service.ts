import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CartItemDto } from '../models/cart.models';

export interface OrderDto {
  id: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  contactPhone: string;
  items: CartItemDto[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1/orders`;

  createOrder(): Observable<OrderDto> {
    return this.http.post<OrderDto>(this.apiUrl, {});
  }

  getOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(this.apiUrl);
  }

  updateStatus(id: number, status: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, null, {
      params: { status }
    });
  }
}
