import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartDto } from '../models/cart.models';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private apiUrl = `${environment.apiUrl}/api/v1/cart`;

  cartCountSig = signal<number>(0);
  cartSig = signal<CartDto | null>(null);

  getCart() {
    return this.http.get<CartDto>(this.apiUrl).pipe(
      tap(cart => this.updateState(cart))
    );
  }

  addToCart(productId: number, quantity: number = 1) {
    return this.http.post<CartDto>(`${this.apiUrl}/items`, { productId, quantity }).pipe(
      tap(cart => {
        this.updateState(cart);
      })
    );
  }

  removeItem(cartItemId: number) {
    return this.http.delete<CartDto>(`${this.apiUrl}/items/${cartItemId}`).pipe(
      tap(cart => {
        this.updateState(cart);
        this.messageService.add({ severity: 'info', summary: 'Корзина', detail: 'Товар удален' });
      })
    );
  }

  clearCart() {
    return this.http.delete<void>(this.apiUrl).pipe(
      tap(() => {
        this.updateState({ items: [], totalPrice: 0 });
      })
    );
  }

  private updateState(cart: CartDto) {
    this.cartSig.set(cart);
    const count = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    this.cartCountSig.set(count);
  }
}
