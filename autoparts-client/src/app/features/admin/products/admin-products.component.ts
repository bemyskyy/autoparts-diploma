import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { ProductDto } from '../../../core/models/catalog.models';
import { MessageService, TreeNode } from 'primeng/api';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
    ToolbarModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule
  ],
  template: `
    <div class="space-y-6">

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Товары</h1>
                <p class="text-gray-500 text-sm mt-1">Управление ассортиментом магазина</p>
            </div>

            <button
                pButton
                label="Добавить товар"
                icon="pi pi-plus"
                class="bg-blue-600 border-none hover:bg-blue-700 shadow-lg shadow-blue-600/30 px-6 py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5"
                (click)="openNew()">
            </button>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

            <div class="p-5 border-b border-gray-100 bg-white">
                <div class="relative w-full sm:w-96">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i class="pi pi-search text-gray-400"></i>
                  </div>
                  <input
                      pInputText
                      type="text"
                      (input)="dt.filterGlobal($any($event.target).value, 'contains')"
                      placeholder="Поиск по названию или SKU..."
                      class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  />
               </div>
            </div>

            <p-table
                #dt
                [value]="products"
                [paginator]="true"
                [rows]="10"
                [rowsPerPageOptions]="[10, 25, 50]"
                [globalFilterFields]="['name', 'sku', 'categoryName']"
                styleClass="p-datatable-gridlines-none"
                [tableStyle]="{ 'min-width': '60rem' }"
                [rowHover]="true"
            >
                <ng-template pTemplate="header">
                <tr class="bg-gray-50/50 text-xs uppercase text-gray-500 tracking-wider border-b border-gray-100">
                    <th class="py-4 pl-6 w-24">Фото</th>
                    <th pSortableColumn="name">Название <p-sortIcon field="name"></p-sortIcon></th>
                    <th pSortableColumn="sku" class="w-32">Артикул <p-sortIcon field="sku"></p-sortIcon></th>
                    <th pSortableColumn="categoryName" class="w-48">Категория <p-sortIcon field="categoryName"></p-sortIcon></th>
                    <th pSortableColumn="price" class="text-right w-32">Цена <p-sortIcon field="price"></p-sortIcon></th>
                    <th pSortableColumn="stockQuantity" class="text-center w-32">Остаток <p-sortIcon field="stockQuantity"></p-sortIcon></th>
                    <th class="text-center w-32">Действия</th>
                </tr>
                </ng-template>

                <ng-template pTemplate="body" let-product>
                <tr class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                    <td class="pl-6 py-3">
                        <div class="w-12 h-12 rounded-lg bg-white border border-gray-200 p-1 flex items-center justify-center overflow-hidden">
                             <img [src]="product.imageUrl || 'https://placehold.co/100?text=No+Img'" class="w-full h-full object-contain mix-blend-multiply"/>
                        </div>
                    </td>
                    <td class="font-bold text-gray-800 text-sm">{{ product.name }}</td>
                    <td>
                        <span class="bg-gray-100 text-gray-500 text-xs font-mono px-2 py-1 rounded border border-gray-200">
                            {{ product.sku }}
                        </span>
                    </td>
                    <td>
                        <span class="text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded-md text-blue-700 font-medium text-xs">
                            {{ product.categoryName || 'Без категории' }}
                        </span>
                    </td>
                    <td class="text-right font-bold text-gray-900">
                        {{ product.price | number:'1.0-0' }} ₽
                    </td>
                    <td class="text-center">
                        <div [class]="getStockClass(product.stockQuantity) + ' inline-flex px-2 py-1 rounded-md text-xs font-bold'">
                            {{ product.stockQuantity }} шт.
                        </div>
                    </td>
                    <td class="text-center">
                    <div class="flex items-center justify-center gap-2">
                        <button
                            pButton
                            icon="pi pi-pencil"
                            class="p-button-rounded p-button-text p-button-secondary w-8 h-8 hover:bg-blue-50 hover:text-blue-600"
                            (click)="editProduct(product)"
                            pTooltip="Редактировать">
                        </button>
                        <button
                            pButton
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-text p-button-secondary w-8 h-8 hover:bg-red-50 hover:text-red-600"
                            (click)="deleteProduct(product)"
                            pTooltip="Удалить">
                        </button>
                    </div>
                    </td>
                </tr>
                </ng-template>

                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="7" class="text-center py-10 text-gray-500">
                            Товары не найдены. <span class="text-blue-500 cursor-pointer" (click)="openNew()">Добавить первый?</span>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

      <p-dialog
        [(visible)]="productDialog"
        [style]="{width: '600px', maxWidth: '95vw'}"
        header="Карточка товара"
        [modal]="true"
        styleClass="p-fluid custom-dialog"
        [draggable]="false"
        [resizable]="false"
        [closeOnEscape]="true"
        [dismissableMask]="true"
      >
        <ng-template pTemplate="content">
          <div class="flex flex-col gap-5 pt-2">

            <div class="flex justify-center mb-2">
                 <div class="w-32 h-32 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
                     <img *ngIf="product.imageUrl" [src]="product.imageUrl" class="w-full h-full object-contain mix-blend-multiply p-2">
                     <i *ngIf="!product.imageUrl" class="pi pi-image text-3xl text-gray-300"></i>
                     <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs text-center p-2">
                        Вставьте URL ниже
                     </div>
                 </div>
            </div>

            <div class="field">
                <label for="name" class="font-bold text-gray-700 mb-1 block">Название товара <span class="text-red-500">*</span></label>
                <input
                    type="text"
                    pInputText
                    id="name"
                    [(ngModel)]="product.name"
                    required
                    autofocus
                    class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder="Например: Масло моторное 5W-40"
                />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="field">
                    <label for="sku" class="font-bold text-gray-700 mb-1 block">Артикул (SKU) <span class="text-red-500">*</span></label>
                    <input
                        type="text"
                        pInputText
                        id="sku"
                        [(ngModel)]="product.sku"
                        required
                        class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 transition-all"
                        placeholder="AB-12345"
                    />
                </div>
                <div class="field">
                    <label for="category" class="font-bold text-gray-700 mb-1 block">Категория</label>
                    <p-dropdown
                        [options]="flatCategories"
                        [(ngModel)]="selectedCategory"
                        optionLabel="label"
                        placeholder="Выберите категорию"
                        [filter]="true"
                        styleClass="w-full"
                        [style]="{'background-color': '#F9FAFB', 'border-radius': '0.75rem', 'border-color': '#E5E7EB'}"
                        appendTo="body"
                    ></p-dropdown>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="field">
                    <label for="price" class="font-bold text-gray-700 mb-1 block">Цена (₽)</label>
                    <p-inputNumber
                        id="price"
                        [(ngModel)]="product.price"
                        mode="currency"
                        currency="RUB"
                        locale="ru-RU"
                        [minFractionDigits]="0"
                        styleClass="w-full"
                        [inputStyle]="{'background-color': '#F9FAFB', 'border-radius': '0.75rem'}"
                    ></p-inputNumber>
                </div>
                <div class="field">
                    <label for="quantity" class="font-bold text-gray-700 mb-1 block">Остаток (шт)</label>
                    <p-inputNumber
                        id="quantity"
                        [(ngModel)]="product.stockQuantity"
                        styleClass="w-full"
                        [inputStyle]="{'background-color': '#F9FAFB', 'border-radius': '0.75rem'}"
                        [showButtons]="true"
                        buttonLayout="horizontal"
                        spinnerMode="horizontal"
                        decrementButtonClass="p-button-secondary p-button-text"
                        incrementButtonClass="p-button-secondary p-button-text"
                        incrementButtonIcon="pi pi-plus"
                        decrementButtonIcon="pi pi-minus"
                    ></p-inputNumber>
                </div>
            </div>

            <div class="field">
                <label for="image" class="font-bold text-gray-700 mb-1 block">Ссылка на фото</label>
                <div class="relative">
                    <i class="pi pi-link absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        pInputText
                        id="image"
                        [(ngModel)]="product.imageUrl"
                        class="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 transition-all"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
            </div>

            <div class="field">
                <label for="description" class="font-bold text-gray-700 mb-1 block">Описание</label>
                <textarea
                    id="description"
                    pInputTextarea
                    [(ngModel)]="product.description"
                    rows="3"
                    class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 transition-all"
                    placeholder="Краткое описание товара..."
                ></textarea>
            </div>

          </div>
        </ng-template>

        <ng-template pTemplate="footer">
            <div class="flex justify-end gap-2 pt-4">
                <button
                    pButton
                    label="Отмена"
                    class="p-button-text p-button-secondary font-bold"
                    (click)="productDialog = false">
                </button>
                <button
                    pButton
                    label="Сохранить"
                    icon="pi pi-check"
                    class="bg-blue-600 border-none hover:bg-blue-700 px-6 rounded-xl font-bold shadow-lg shadow-blue-500/20"
                    (click)="saveProduct()">
                </button>
            </div>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    /* Стили для PrimeNG элементов внутри Tailwind контекста */
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th { background: transparent; border: none; }
    :host ::ng-deep .p-dropdown { border: 1px solid #E5E7EB; border-radius: 0.75rem; background: #F9FAFB; }
    :host ::ng-deep .p-dropdown:not(.p-disabled).p-focus { border-color: #3B82F6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); background: white; }

    :host ::ng-deep .p-inputnumber-input { width: 100%; border: 1px solid #E5E7EB; padding: 0.75rem; }
    :host ::ng-deep .p-inputnumber-input:focus { border-color: #3B82F6; outline: none; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); background: white; }

    :host ::ng-deep .p-dialog .p-dialog-header { border-bottom: 1px solid #F3F4F6; padding: 1.5rem; border-top-left-radius: 1rem; border-top-right-radius: 1rem; }
    :host ::ng-deep .p-dialog .p-dialog-content { padding: 1.5rem; }
    :host ::ng-deep .p-dialog .p-dialog-footer { padding: 1rem 1.5rem; border-top: 1px solid #F3F4F6; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; }
    :host ::ng-deep .custom-dialog { border-radius: 1rem; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 1px solid #E5E7EB; }
  `]
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private messageService = inject(MessageService);

  products: ProductDto[] = [];
  flatCategories: any[] = [];

  productDialog = false;
  product: any = {};
  selectedCategory: any = null;

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getAll().subscribe(data => this.products = data);
  }

  loadCategories() {
    this.categoryService.getTree().subscribe(tree => {
      this.flatCategories = this.flattenTree(tree);
    });
  }

  flattenTree(nodes: TreeNode[]): any[] {
    let result: any[] = [];
    for (const node of nodes) {
      result.push({ label: node.label, value: node.data });
      if (node.children) {
        result = result.concat(this.flattenTree(node.children));
      }
    }
    return result;
  }

  openNew() {
    this.product = {};
    this.selectedCategory = null;
    this.productDialog = true;
  }

  editProduct(product: ProductDto) {
    this.product = { ...product };
    this.selectedCategory = this.flatCategories.find(c => c.value === product.categoryId);
    this.productDialog = true;
  }

  deleteProduct(product: ProductDto) {
    if (confirm(`Удалить товар "${product.name}"?`)) {
      this.productService.delete(product.id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Товар удален' });
          this.loadProducts();
        }
      });
    }
  }

  saveProduct() {
    if (!this.product.name || !this.product.sku) {
        this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Заполните обязательные поля' });
        return;
    }

    const request = {
      ...this.product,
      categoryId: this.selectedCategory ? this.selectedCategory.value : null
    };

    if (this.product.id) {
      this.productService.update(this.product.id, request).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Товар обновлен' });
          this.productDialog = false;
          this.loadProducts();
        }
      });
    } else {
      this.productService.create(request).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Товар создан' });
          this.productDialog = false;
          this.loadProducts();
        }
      });
    }
  }

  getStockClass(quantity: number): string {
      if (quantity === 0) return 'bg-red-50 text-red-600 border border-red-100';
      if (quantity < 5) return 'bg-orange-50 text-orange-600 border border-orange-100';
      return 'bg-green-50 text-green-600 border border-green-100';
  }
}
