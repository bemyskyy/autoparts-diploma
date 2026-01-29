import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CategoryService } from '../../core/services/category.service';
import { TreeNode } from 'primeng/api';

import { TreeModule } from 'primeng/tree';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    TreeModule,
    SidebarModule,
    ButtonModule
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50">

      <app-header (search)="onSearch($event)"></app-header>

      <div class="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 gap-8 relative">

        <aside class="w-72 hidden lg:flex flex-col gap-6 sticky top-28 h-fit">

          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-5">
            <h3 class="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">
              <i class="pi pi-list"></i> Каталог
            </h3>

            <ng-container *ngTemplateOutlet="categoriesTree"></ng-container>
          </div>

          <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group cursor-pointer transform transition-transform hover:-translate-y-1">
            <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
            <div class="absolute -left-6 bottom-0 w-24 h-24 bg-blue-500/30 rounded-full blur-2xl"></div>

            <h4 class="text-xl font-bold relative z-10 leading-tight">Сезонное ТО</h4>
            <p class="text-blue-100 text-sm mt-2 relative z-10 mb-5 leading-relaxed">
              Масло, фильтры и свечи.<br>Скидки до <span class="text-yellow-300 font-bold">20%</span>
            </p>
            <button class="bg-white text-blue-700 text-xs font-bold py-2.5 px-5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2">
              Перейти <i class="pi pi-arrow-right text-[10px]"></i>
            </button>
          </div>

        </aside>

        <div class="lg:hidden w-full mb-4">
            <button
                pButton
                label="Каталог запчастей"
                icon="pi pi-bars"
                class="w-full p-button-outlined p-button-secondary border-gray-300 bg-white text-gray-700"
                (click)="mobileSidebarVisible = true">
            </button>
        </div>

        <main class="flex-1 w-full min-w-0">
          <router-outlet></router-outlet>
        </main>

      </div>

      <app-footer></app-footer>

    </div>

    <p-sidebar [(visible)]="mobileSidebarVisible" position="left" styleClass="w-80">
        <ng-template pTemplate="header">
            <span class="font-bold text-xl text-gray-800">Категории</span>
        </ng-template>
        <div class="mt-4">
             <ng-container *ngTemplateOutlet="categoriesTree"></ng-container>
        </div>
    </p-sidebar>


    <ng-template #categoriesTree>
        <p-tree
            [value]="categories"
            selectionMode="single"
            (onNodeSelect)="onCategorySelect($event)"
            styleClass="w-full border-none p-0 custom-tree"
            [filter]="true"
            filterPlaceholder="Фильтр категорий..."
        >
            <ng-template let-node pTemplate="default">
                <span class="text-sm text-gray-600 font-medium group-hover:text-blue-600 transition-colors">
                    {{node.label}}
                </span>
            </ng-template>
        </p-tree>
    </ng-template>
  `,
  styles: [`
    /* Глубокая стилизация PrimeNG Tree для современного вида */
    :host ::ng-deep {
      .custom-tree .p-tree-container {
        padding: 0;
      }

      .custom-tree .p-treenode-content {
        padding: 0.6rem 0.5rem !important;
        border-radius: 0.75rem; /* Скругленные углы строк */
        margin-bottom: 2px;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }

      /* Ховер эффект */
      .custom-tree .p-treenode-content:hover {
        background-color: #F8FAFC !important; /* slate-50 */
        border-color: #E2E8F0;
      }

      /* Активный элемент */
      .custom-tree .p-treenode-content.p-highlight {
        background-color: #EFF6FF !important; /* blue-50 */
        border-color: #BFDBFE; /* blue-200 */
      }

      .custom-tree .p-treenode-content.p-highlight .p-tree-toggler {
        color: #2563EB !important;
      }

      .custom-tree .p-treenode-content.p-highlight .text-gray-600 {
        color: #1D4ED8 !important; /* blue-700 */
        font-weight: 700;
      }

      /* Иконка стрелочки */
      .p-tree-toggler {
        width: 1.5rem;
        height: 1.5rem;
        margin-right: 0.25rem;
        color: #94A3B8;
      }

      /* Поле фильтра внутри дерева */
      .p-tree-filter-container {
        margin-bottom: 1rem;
      }
      .p-tree-filter {
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid #E5E7EB;
        background: #F9FAFB;
        font-size: 0.875rem;
      }
      .p-tree-filter:focus {
        border-color: #3B82F6;
        outline: none;
        background: #FFFFFF;
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  categories: TreeNode[] = [];
  mobileSidebarVisible = false;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getTree().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Ошибка загрузки категорий', err)
    });
  }

  onCategorySelect(event: any) {
    const categoryId = event.node.data;

    this.mobileSidebarVisible = false;

    this.router.navigate(['/catalog'], { queryParams: { category: categoryId } });
  }

  onSearch(query: string) {
    this.router.navigate(['/catalog'], { queryParams: { q: query } });
  }
}
