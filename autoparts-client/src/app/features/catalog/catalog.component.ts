import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';

import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ProductDto } from '../../core/models/catalog.models';

import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    SkeletonModule,
    ButtonModule
  ],
  template: `
    <div class="fade-in pb-12">

      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Каталог запчастей</h1>
          <p class="text-gray-500 mt-2 text-sm" *ngIf="!isLoading">
            Найдено <span class="font-bold text-gray-800">{{ products.length }}</span> товаров
          </p>
          <p class="text-gray-500 mt-2 text-sm" *ngIf="isLoading">
            <p-skeleton width="150px" height="1rem"></p-skeleton>
          </p>
        </div>

        <div class="w-full md:w-64">
          <p-dropdown
            [options]="sortOptions"
            [(ngModel)]="selectedSort"
            (onChange)="onSortChange()"
            optionLabel="label"
            placeholder="Сортировка"
            styleClass="w-full"
            [disabled]="isLoading">
          </p-dropdown>
        </div>
      </div>

      <div *ngIf="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
           <p-skeleton height="180px" styleClass="mb-4 rounded-xl"></p-skeleton>
           <p-skeleton width="40%" styleClass="mb-2"></p-skeleton>
           <p-skeleton width="80%" styleClass="mb-4"></p-skeleton>
           <div class="flex justify-between items-center mt-4">
             <p-skeleton width="30%" height="2rem"></p-skeleton>
             <p-skeleton shape="circle" size="2.5rem"></p-skeleton>
           </div>
        </div>
      </div>

      <div *ngIf="!isLoading && products.length === 0" class="flex flex-col items-center justify-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 border-dashed">
        <div class="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <i class="pi pi-search text-4xl text-blue-300"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Ничего не найдено</h3>
        <p class="text-gray-500 text-center max-w-sm">
          Мы не нашли товаров по вашему запросу. Попробуйте изменить категорию или поисковый запрос.
        </p>
      </div>

      <div *ngIf="!isLoading && products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        <div *ngFor="let product of products" class="group relative bg-white rounded-2xl p-4 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 flex flex-col h-full">

          <div class="absolute top-4 left-4 z-10 flex gap-2">
             <span *ngIf="product.stockQuantity === 0" class="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
               Нет в наличии
             </span>
             <span *ngIf="product.stockQuantity > 0 && product.stockQuantity < 5" class="bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
               Заканчивается
             </span>
          </div>

          <div class="relative h-56 mb-5 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
            <img
              [src]="product.imageUrl || 'https://placehold.co/400x300?text=No+Image'"
              [alt]="product.name"
              class="h-full w-full object-contain p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>

          <div class="flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-2">
               <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-widest">
                 SKU: {{ product.sku }}
               </span>
            </div>

            <h3 class="font-bold text-gray-800 text-base leading-snug mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer" title="{{product.name}}">
              {{ product.name }}
            </h3>

            <div class="mt-auto pt-4 flex items-center justify-between border-t border-gray-50/50">
              <div class="flex flex-col">
                <span class="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {{ product.price | number:'1.0-0' }} ₽
                </span>
                <span class="text-xs text-gray-400 font-medium">Цена за шт.</span>
              </div>

              <button
                pButton
                icon="pi pi-shopping-cart"
                (click)="addToCart(product)"
                [disabled]="product.stockQuantity === 0"
                class="w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm hover:shadow-blue-200"
                [ngClass]="{
                    'bg-gray-100 text-gray-400 cursor-not-allowed': product.stockQuantity === 0,
                    'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95': product.stockQuantity > 0
                }"
              >
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* Кастомизация дропдауна PrimeNG под Tailwind */
    :host ::ng-deep .p-dropdown {
        border-radius: 0.75rem;
        border-color: #E5E7EB;
    }
    :host ::ng-deep .p-dropdown:not(.p-disabled).p-focus {
        border-color: #3B82F6;
        box-shadow: 0 0 0 2px #BFDBFE;
    }
  `]
})
export class CatalogComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private messageService = inject(MessageService);

  products: ProductDto[] = [];
  isLoading = true;

  sortOptions = [
    { label: 'По популярности', value: 'popular' },
    { label: 'Сначала дешевые', value: 'price_asc' },
    { label: 'Сначала дорогие', value: 'price_desc' }
  ];
  selectedSort = this.sortOptions[0];

  ngOnInit() {
    this.route.queryParams.pipe(
      switchMap(params => {
        this.isLoading = true;

        const categoryId = params['category'] ? Number(params['category']) : undefined;
        const query = params['q'];

        return this.productService.getAll(categoryId, query);
      })
    ).subscribe({
      next: (data) => {
        this.products = data;
        this.sortProducts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить товары' });
        this.isLoading = false;
      }
    });
  }

  onSortChange() {
    this.sortProducts();
  }

  sortProducts() {
    if (this.selectedSort.value === 'price_asc') {
      this.products.sort((a, b) => a.price - b.price);
    } else if (this.selectedSort.value === 'price_desc') {
      this.products.sort((a, b) => b.price - a.price);
    }
  }

  addToCart(product: ProductDto) {
    if (product.stockQuantity === 0) return;

    this.cartService.addToCart(product.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Добавлено',
          detail: `${product.name} в корзине`,
          life: 2000
        });
      },
      error: () => {
         this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось добавить товар' });
      }
    });
  }
}
