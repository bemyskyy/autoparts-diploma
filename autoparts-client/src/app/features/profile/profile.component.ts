import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderDto, OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/auth/auth.service';

import { HeaderComponent } from '../../layout/header/header.component';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    TableModule,
    TagModule,
    ButtonModule,
    CardModule,
    AvatarModule,
    TooltipModule,
    BadgeModule
  ],
  template: `
    <div class="min-h-screen bg-[#F8F9FA] flex flex-col">

      <app-header></app-header>

      <div class="flex-1 relative pb-12 fade-in">
        <div class="h-56 bg-gradient-to-r from-slate-800 to-blue-900 w-full absolute top-0 left-0 z-0"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-8">

          <h1 class="text-3xl font-bold text-white mb-8">Личный кабинет</h1>

          <div class="flex flex-col lg:flex-row gap-8">

            <div class="w-full lg:w-80 flex-shrink-0">
              <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-28">

                <div class="flex flex-col items-center text-center">
                  <div class="relative mb-4">
                    <p-avatar
                      icon="pi pi-user"
                      size="xlarge"
                      shape="circle"
                      styleClass="w-24 h-24 bg-blue-50 text-blue-600 text-4xl border-4 border-white shadow-md">
                    </p-avatar>
                    <span class="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>

                  <h2 class="text-xl font-bold text-gray-900">
                    {{ user()?.firstName }} {{ user()?.lastName }}
                  </h2>
                  <p class="text-gray-500 text-sm mt-1 font-medium bg-gray-50 px-3 py-1 rounded-full">
                      {{ user()?.phone || 'Гость' }}
                  </p>

                  <div class="mt-6 w-full space-y-2">
                     <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span class="text-sm text-gray-500">Всего заказов</span>
                        <span class="font-bold text-gray-900">{{ orders.length }}</span>
                     </div>
                  </div>

                  <div class="w-full border-t border-gray-100 my-6"></div>

                  <button
                    (click)="logout()"
                    class="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-3 rounded-xl transition-colors font-medium">
                    <i class="pi pi-sign-out"></i> Выйти из аккаунта
                  </button>
                </div>
              </div>
            </div>

            <div class="flex-1">
              <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-h-[400px]">

                <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                   <h3 class="font-bold text-lg text-gray-800">История заказов</h3>
                   <button pButton icon="pi pi-refresh" class="p-button-text p-button-rounded p-button-secondary" (click)="loadOrders()" pTooltip="Обновить список"></button>
                </div>

                <div *ngIf="!isLoading && orders.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
                   <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <i class="pi pi-inbox text-3xl text-gray-300"></i>
                   </div>
                   <h4 class="text-gray-900 font-bold text-lg">Заказов пока нет</h4>
                   <p class="text-gray-500 max-w-xs mt-2 mb-6">Вы еще ничего не заказывали. Самое время выбрать что-то для своего авто.</p>
                   <button pButton label="Перейти в каталог" routerLink="/catalog" class="p-button-rounded"></button>
                </div>

                <p-table
                  *ngIf="orders.length > 0"
                  [value]="orders"
                  dataKey="id"
                  [expandedRowKeys]="expandedRows"
                  styleClass="p-datatable-gridlines-none"
                  [tableStyle]="{ 'min-width': '50rem' }"
                >
                  <ng-template pTemplate="header">
                    <tr class="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                      <th style="width: 4rem"></th>
                      <th class="py-4 pl-4 font-medium">№ Заказа</th>
                      <th class="font-medium">Дата</th>
                      <th class="font-medium">Сумма</th>
                      <th class="font-medium">Статус</th>
                    </tr>
                  </ng-template>

                  <ng-template pTemplate="body" let-order let-expanded="expanded">
                    <tr class="hover:bg-blue-50/30 transition-colors border-b border-gray-50 last:border-0 cursor-pointer" [pRowToggler]="order">
                      <td class="text-center">
                        <button type="button" pButton pRipple class="p-button-text p-button-rounded p-button-plain p-button-sm w-8 h-8" [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"></button>
                      </td>
                      <td class="font-bold text-gray-700 py-5 pl-4">
                         <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">#{{ order.id }}</span>
                      </td>
                      <td class="text-gray-600 text-sm font-medium">
                        {{ order.createdAt | date:'dd.MM.yyyy' }} <span class="text-gray-400 text-xs">{{ order.createdAt | date:'HH:mm' }}</span>
                      </td>
                      <td class="font-bold text-gray-900">
                        {{ order.totalPrice | number:'1.0-0' }} ₽
                      </td>
                      <td>
                        <p-tag [value]="getStatusLabel(order.status)" [severity]="getStatusSeverity(order.status)" styleClass="text-xs font-bold uppercase tracking-wide px-3"></p-tag>
                      </td>
                    </tr>
                  </ng-template>

                  <ng-template pTemplate="rowexpansion" let-order>
                    <tr>
                      <td colspan="5" class="p-0 border-b border-gray-100 bg-gray-50/50">
                        <div class="p-6">
                          <div class="flex items-center gap-2 mb-4">
                             <i class="pi pi-box text-blue-500"></i>
                             <h4 class="font-bold text-gray-700 text-sm uppercase tracking-wide">Состав заказа</h4>
                          </div>

                          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                              <div *ngFor="let item of order.items; let last = last" class="flex flex-col sm:flex-row items-center gap-4 p-4 hover:bg-slate-50 transition-colors" [class.border-b]="!last" [class.border-gray-100]="!last">
                                  <div class="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                                     <img *ngIf="item.imageUrl" [src]="item.imageUrl" class="w-full h-full object-cover mix-blend-multiply">
                                     <i *ngIf="!item.imageUrl" class="pi pi-image text-gray-400 text-xl"></i>
                                  </div>
                                  <div class="flex-1 text-center sm:text-left">
                                     <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">SKU: {{ item.sku }}</div>
                                     <div class="font-bold text-gray-800 text-sm">{{ item.name }}</div>
                                  </div>
                                  <div class="text-right w-24">
                                     <span class="font-bold text-blue-600">{{ (item.price * item.quantity) | number:'1.0-0' }} ₽</span>
                                  </div>
                              </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </ng-template>
                </p-table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th { background: transparent; border: none; }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td { border-width: 0 0 1px 0; }
  `]
})
export class ProfileComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);

  orders: OrderDto[] = [];
  expandedRows = {};
  isLoading = true;

  user = this.authService.currentUserSig;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getStatusSeverity(status: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | undefined {
    switch (status) {
      case 'CREATED': return 'secondary';
      case 'CONFIRMED': return 'info';
      case 'PAID': return 'success';
      case 'SHIPPED': return 'warning';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'info';
    }
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'CREATED': 'Создан', 'CONFIRMED': 'Подтвержден', 'PAID': 'Оплачен',
      'SHIPPED': 'В пути', 'COMPLETED': 'Выдан', 'CANCELLED': 'Отменен'
    };
    return map[status] || status;
  }
}
