import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderDto, OrderService } from '../../../core/services/order.service';
import { MessageService } from 'primeng/api';

import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DropdownModule,
    TagModule,
    InputTextModule,
    ButtonModule,
    TooltipModule,
    CardModule,
    IconFieldModule,
    InputIconModule
  ],
  template: `
    <div class="space-y-6">

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
           <div>
              <p class="text-gray-500 text-sm font-medium mb-1">Всего заказов</p>
              <h3 class="text-2xl font-extrabold text-gray-900">{{ orders.length }}</h3>
           </div>
           <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
              <i class="pi pi-shopping-bag"></i>
           </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
           <div>
              <p class="text-gray-500 text-sm font-medium mb-1">Общая выручка</p>
              <h3 class="text-2xl font-extrabold text-gray-900">{{ totalRevenue | number:'1.0-0' }} ₽</h3>
           </div>
           <div class="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl">
              <i class="pi pi-wallet"></i>
           </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
           <div>
              <p class="text-gray-500 text-sm font-medium mb-1">В обработке</p>
              <h3 class="text-2xl font-extrabold text-orange-600">{{ pendingCount }}</h3>
           </div>
           <div class="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl">
              <i class="pi pi-clock"></i>
           </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

        <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 class="text-lg font-bold text-gray-800">Список заказов</h2>

          <div class="flex gap-3 w-full sm:w-auto items-center">

             <div class="relative w-full sm:w-72">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="pi pi-search text-gray-400"></i>
                </div>
                <input
                    pInputText
                    type="text"
                    (input)="dt.filterGlobal($any($event.target).value, 'contains')"
                    placeholder="Поиск по ID или телефону..."
                    class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                />
             </div>

             <button
                pButton
                icon="pi pi-refresh"
                class="p-button-rounded p-button-text p-button-secondary w-10 h-10"
                (click)="loadOrders()"
                pTooltip="Обновить данные">
             </button>
          </div>
        </div>

        <p-table
            #dt
            [value]="orders"
            [paginator]="true"
            [rows]="10"
            [rowsPerPageOptions]="[10, 25, 50]"
            [globalFilterFields]="['id', 'contactPhone', 'totalPrice']"
            dataKey="id"
            [rowHover]="true"
            styleClass="p-datatable-gridlines-none p-datatable-sm"
            [tableStyle]="{ 'min-width': '60rem' }"
        >
          <ng-template pTemplate="header">
            <tr class="bg-gray-50/50 text-xs uppercase text-gray-500 tracking-wider border-b border-gray-100">
              <th style="width: 3rem"></th>
              <th pSortableColumn="id" class="py-4 pl-4">ID <p-sortIcon field="id"></p-sortIcon></th>
              <th pSortableColumn="createdAt">Дата <p-sortIcon field="createdAt"></p-sortIcon></th>
              <th>Клиент</th>
              <th pSortableColumn="totalPrice">Сумма <p-sortIcon field="totalPrice"></p-sortIcon></th>
              <th>Статус</th>
              <th class="text-center">Позиций</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-order let-expanded="expanded">
            <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
              <td class="text-center">
                <button type="button" pButton pRipple [pRowToggler]="order" class="p-button-text p-button-rounded p-button-plain p-button-sm w-8 h-8" [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"></button>
              </td>
              <td class="font-bold text-gray-700 pl-4">#{{ order.id }}</td>
              <td class="text-sm">
                <div class="font-medium text-gray-900">{{ order.createdAt | date:'dd.MM.yyyy' }}</div>
                <div class="text-xs text-gray-400">{{ order.createdAt | date:'HH:mm' }}</div>
              </td>
              <td>
                 <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                        <i class="pi pi-user text-xs"></i>
                    </div>
                    <div>
                        <div class="text-sm font-bold text-gray-800">{{ order.contactPhone }}</div>
                        <div class="text-xs text-gray-500">Покупатель</div>
                    </div>
                 </div>
              </td>
              <td class="font-bold text-gray-900">
                {{ order.totalPrice | number:'1.0-0' }} ₽
              </td>
              <td>
                <p-dropdown
                  [options]="statuses"
                  [(ngModel)]="order.status"
                  (onChange)="onStatusChange(order)"
                  appendTo="body"
                  styleClass="w-40 border-0 shadow-none bg-transparent"
                  [panelStyle]="{'border-radius': '12px', 'box-shadow': '0 10px 30px rgba(0,0,0,0.1)'}"
                >
                  <ng-template pTemplate="selectedItem">
                    <p-tag [value]="getStatusLabel(order.status)" [severity]="getSeverity(order.status)" styleClass="text-xs font-bold uppercase tracking-wide px-2 py-1"></p-tag>
                  </ng-template>
                  <ng-template pTemplate="item" let-status>
                    <div class="flex items-center gap-2 py-1">
                        <span [class]="'w-2 h-2 rounded-full ' + getStatusDotColor(status)"></span>
                        <span class="text-sm">{{ getStatusLabel(status) }}</span>
                    </div>
                  </ng-template>
                </p-dropdown>
              </td>
              <td class="text-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  {{ order.items.length }} шт.
                </span>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="rowexpansion" let-order>
            <tr>
              <td colspan="7" class="p-0 bg-gray-50/30 border-b border-gray-100">
                <div class="p-6 pl-16">
                  <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <i class="pi pi-box"></i> Состав заказа #{{order.id}}
                  </h4>

                  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-4xl">
                      <table class="w-full text-sm text-left">
                          <thead class="bg-gray-50 text-gray-500 font-medium">
                              <tr>
                                  <th class="px-4 py-3 border-b border-gray-100">Товар</th>
                                  <th class="px-4 py-3 border-b border-gray-100">Артикул</th>
                                  <th class="px-4 py-3 text-right border-b border-gray-100">Цена</th>
                                  <th class="px-4 py-3 text-center border-b border-gray-100">Кол-во</th>
                                  <th class="px-4 py-3 text-right border-b border-gray-100">Итого</th>
                              </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-100">
                              <tr *ngFor="let item of order.items">
                                  <td class="px-4 py-3 font-medium text-gray-900 flex items-center gap-3">
                                      <div class="w-9 h-9 rounded bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                                          <img *ngIf="item.imageUrl" [src]="item.imageUrl" class="w-full h-full object-cover mix-blend-multiply">
                                          <i *ngIf="!item.imageUrl" class="pi pi-image text-gray-300 text-xs"></i>
                                      </div>
                                      {{ item.name }}
                                  </td>
                                  <td class="px-4 py-3 text-gray-500 font-mono text-xs">{{ item.sku }}</td>
                                  <td class="px-4 py-3 text-right text-gray-600">{{ item.price | number:'1.0-0' }} ₽</td>
                                  <td class="px-4 py-3 text-center font-bold text-gray-800">x{{ item.quantity }}</td>
                                  <td class="px-4 py-3 text-right font-bold text-blue-600">{{ (item.price * item.quantity) | number:'1.0-0' }} ₽</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
             <tr>
                <td colspan="7" class="text-center py-12 text-gray-500">
                   <div class="flex flex-col items-center justify-center">
                      <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <i class="pi pi-search text-gray-400"></i>
                      </div>
                      <p>Заказы не найдены.</p>
                   </div>
                </td>
             </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th { background: transparent; border: none; }
    :host ::ng-deep .p-dropdown-panel { border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
  `]
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private messageService = inject(MessageService);

  orders: OrderDto[] = [];

  statuses = ['CREATED', 'CONFIRMED', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe(data => {
        this.orders = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });
  }

  get totalRevenue(): number {
    return this.orders
        .filter(o => o.status !== 'CANCELLED')
        .reduce((acc, curr) => acc + curr.totalPrice, 0);
  }

  get pendingCount(): number {
    return this.orders.filter(o => ['CREATED', 'CONFIRMED'].includes(o.status)).length;
  }

  onStatusChange(order: OrderDto) {
    this.orderService.updateStatus(order.id, order.status).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успешно',
          detail: `Статус заказа #${order.id} изменен на ${this.getStatusLabel(order.status)}`
        });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить статус' });
      }
    });
  }

  getSeverity(status: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | undefined {
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
      'CREATED': 'Новый',
      'CONFIRMED': 'Подтвержден',
      'PAID': 'Оплачен',
      'SHIPPED': 'В пути',
      'COMPLETED': 'Выдан',
      'CANCELLED': 'Отменен'
    };
    return map[status] || status;
  }

  getStatusDotColor(status: string): string {
      switch (status) {
          case 'CREATED': return 'bg-gray-400';
          case 'CONFIRMED': return 'bg-blue-400';
          case 'PAID': return 'bg-green-500';
          case 'SHIPPED': return 'bg-orange-400';
          case 'COMPLETED': return 'bg-green-600';
          case 'CANCELLED': return 'bg-red-500';
          default: return 'bg-gray-400';
      }
  }
}
