import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';

import { HeaderComponent } from '../../layout/header/header.component';

import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    TooltipModule,
    HeaderComponent,
    DialogModule
  ],
  template: `
    <div class="min-h-screen bg-[#F8F9FA] flex flex-col">

      <app-header></app-header>

      <div class="fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">

        <h1 class="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <span>Корзина</span>
          <span *ngIf="cartCount() > 0" class="text-sm font-medium bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
              {{ cartCount() }} товаров
          </span>
        </h1>

        <div *ngIf="!isLoading && cartCount() === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div class="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
              <i class="pi pi-shopping-cart text-4xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Ваша корзина пуста</h2>
          <p class="text-gray-500 mb-8 text-center max-w-xs">Похоже, вы еще ничего не добавили. Перейдите в каталог, там много интересного.</p>
          <button
              routerLink="/catalog"
              pButton
              label="Перейти к покупкам"
              icon="pi pi-arrow-right"
              iconPos="right"
              class="p-button-rounded p-button-lg">
          </button>
        </div>

        <div *ngIf="cartCount() > 0" class="flex flex-col lg:flex-row gap-8 relative">

          <div class="flex-1 space-y-4">
            <div *ngFor="let item of cart()?.items" class="group relative bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">

              <div class="flex flex-col sm:flex-row items-center gap-6">
                <div class="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                  <img
                    [src]="item.imageUrl || 'https://placehold.co/100?text=No+Img'"
                    [alt]="item.name"
                    class="w-full h-full object-contain mix-blend-multiply p-2"
                  />
                </div>

                <div class="flex-1 min-w-0 text-center sm:text-left w-full">
                  <div class="flex flex-col">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">SKU: {{ item.sku }}</span>
                    <a [routerLink]="['/catalog']" [queryParams]="{q: item.name}" class="text-base sm:text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                      {{ item.name }}
                    </a>
                  </div>
                </div>

                <div class="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">

                  <div class="text-right hidden md:block w-24">
                      <span class="text-xs text-gray-400 block mb-1">Цена</span>
                      <span class="font-medium text-gray-600 whitespace-nowrap">{{ item.price | number:'1.0-0' }} ₽</span>
                  </div>

                  <div class="flex items-center bg-white sm:bg-gray-50 rounded-lg border border-gray-200 shadow-sm sm:shadow-none p-1">
                      <button
                          (click)="updateQuantity(item.productId, -1)"
                          [disabled]="item.quantity <= 1 || isUpdating"
                          class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all disabled:opacity-30">
                          <i class="pi pi-minus text-[10px] font-bold"></i>
                      </button>
                      <span class="w-8 text-center font-bold text-gray-900 text-sm select-none">{{ item.quantity }}</span>
                      <button
                          (click)="updateQuantity(item.productId, 1)"
                          [disabled]="isUpdating"
                          class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                          <i class="pi pi-plus text-[10px] font-bold"></i>
                      </button>
                  </div>

                  <div class="text-right w-24">
                      <span class="text-xs text-gray-400 block sm:hidden mb-1">Сумма</span>
                      <span class="block text-lg font-extrabold text-blue-600 whitespace-nowrap">{{ item.sum | number:'1.0-0' }} ₽</span>
                  </div>
                </div>

                <button
                  (click)="removeItem(item.id)"
                  pTooltip="Удалить"
                  tooltipPosition="left"
                  class="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all absolute top-2 right-2 sm:static"
                >
                  <i class="pi pi-trash text-lg"></i>
                </button>
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button (click)="clearCart()" class="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 group">
                  <i class="pi pi-trash group-hover:animate-bounce"></i> Очистить корзину
              </button>
            </div>
          </div>

          <div class="w-full lg:w-96">
            <div class="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 p-6 sticky top-28">
              <h3 class="text-xl font-bold text-gray-900 mb-6">Ваш заказ</h3>

              <div class="space-y-3 mb-6">
                  <div class="flex justify-between text-gray-500 text-sm">
                      <span>Товары ({{ cartCount() }})</span>
                      <span class="font-medium">{{ cart()?.totalPrice | number:'1.0-0' }} ₽</span>
                  </div>
                  <div class="flex justify-between text-gray-500 text-sm">
                      <span>Скидка</span>
                      <span class="text-green-600 font-medium">0 ₽</span>
                  </div>
                  <div class="h-px bg-gray-100 my-4"></div>

                  <div class="flex justify-between items-end">
                      <span class="text-lg font-bold text-gray-900">Итого к оплате</span>
                      <span class="text-3xl font-extrabold text-blue-600">{{ cart()?.totalPrice | number:'1.0-0' }} ₽</span>
                  </div>
              </div>

              <button
                  pButton
                  label="Оформить заказ"
                  class="w-full font-bold text-lg py-4 border-none bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all rounded-xl"
                  [loading]="isOrdering"
                  (click)="checkout()">
              </button>

              <div class="mt-6 flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                  <i class="pi pi-info-circle text-blue-600 mt-0.5"></i>
                  <p class="text-xs text-blue-800 leading-relaxed">
                    Нажимая кнопку, вы подтверждаете заказ. Оплата и доставка обсуждаются с менеджером.
                  </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <p-dialog
        [(visible)]="showSuccessDialog"
        [modal]="true"
        [style]="{width: '450px'}"
        styleClass="rounded-2xl overflow-hidden"
        [closable]="false"
        [draggable]="false"
        [resizable]="false">

        <ng-template pTemplate="header">
            <div class="w-full text-center pt-6">
                <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <i class="pi pi-check text-4xl text-green-600 font-bold"></i>
                </div>
                <h2 class="text-2xl font-extrabold text-gray-900">Спасибо за заказ!</h2>
            </div>
        </ng-template>

        <div class="text-center px-4 pb-4">
            <p class="text-lg font-medium text-gray-700 mb-2">
                Заказ <span class="text-blue-600 font-bold">#{{ createdOrderId }}</span> успешно создан.
            </p>
            <p class="text-gray-500 text-sm leading-relaxed">
                Мы уже видим вашу заявку! В ближайшее время (обычно в течение 15 минут) с вами свяжется менеджер для уточнения
                <span class="font-bold text-gray-700">адреса доставки</span> и
                <span class="font-bold text-gray-700">способа оплаты</span>.
            </p>

            <div class="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 text-left text-sm text-gray-600">
                <p class="mb-1"><i class="pi pi-phone mr-2 text-gray-400"></i> Держите телефон рядом</p>
                <p><i class="pi pi-clock mr-2 text-gray-400"></i> Мы работаем с 09:00 до 21:00</p>
            </div>
        </div>

        <ng-template pTemplate="footer">
            <div class="p-4 pt-0">
                <button
                    pButton
                    label="Понятно, жду звонка"
                    class="w-full p-button-lg font-bold rounded-xl"
                    (click)="closeSuccessDialog()">
                </button>
            </div>
        </ng-template>
      </p-dialog>

    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* Делаем диалог красивым */
    :host ::ng-deep .p-dialog .p-dialog-content { border-radius: 0 !important; }
    :host ::ng-deep .p-dialog .p-dialog-header { border-bottom: none; background: white; padding-bottom: 0; }
    :host ::ng-deep .p-dialog .p-dialog-footer { border-top: none; background: white; padding-top: 0; }
  `]
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  cart = this.cartService.cartSig;
  cartCount = this.cartService.cartCountSig;

  isOrdering = false;
  isUpdating = false;
  isLoading = true;

  showSuccessDialog = false;
  createdOrderId: number | null = null;

  ngOnInit() {
    this.cartService.getCart().subscribe({
        next: () => this.isLoading = false,
        error: () => this.isLoading = false
    });
  }

  updateQuantity(productId: number, delta: number) {
    this.isUpdating = true;
    this.cartService.addToCart(productId, delta).subscribe({
        next: () => this.isUpdating = false,
        error: () => {
            this.isUpdating = false;
            this.messageService.add({severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить количество'});
        }
    });
  }

  removeItem(itemId: number) {
    this.cartService.removeItem(itemId).subscribe({
        next: () => {
             this.messageService.add({severity: 'info', summary: 'Удалено', detail: 'Товар удален из корзины'});
        }
    });
  }

  clearCart() {
    this.cartService.clearCart().subscribe();
  }

  checkout() {
    this.isOrdering = true;
    this.orderService.createOrder().subscribe({
      next: (order) => {
        this.isOrdering = false;

        this.createdOrderId = order.id;
        this.cartService.getCart().subscribe();
        this.showSuccessDialog = true;
      },
      error: (err) => {
        this.isOrdering = false;
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось оформить заказ' });
      }
    });
  }

  closeSuccessDialog() {
      this.showSuccessDialog = false;
      this.router.navigate(['/profile']);
  }
}
