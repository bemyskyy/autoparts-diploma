import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, TabMenuModule, ButtonModule, AvatarModule],
  template: `
    <div class="min-h-screen bg-[#F8F9FA] flex flex-col">

      <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2 text-gray-900">
              <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
                <i class="pi pi-cog spin-slow"></i>
              </div>
              <span class="font-bold text-lg tracking-tight">AdminPanel</span>
            </div>

            <div class="h-6 w-px bg-gray-200"></div>

            <a routerLink="/" class="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2 group">
              <i class="pi pi-arrow-left group-hover:-translate-x-1 transition-transform"></i>
              В магазин
            </a>
          </div>

          <div class="flex items-center gap-4">
            <div class="hidden md:flex flex-col items-end">
              <span class="text-sm font-bold text-gray-800">Администратор</span>
              <span class="text-xs text-gray-500">Super User</span>
            </div>
            <p-avatar icon="pi pi-user" shape="circle" styleClass="bg-blue-100 text-blue-600"></p-avatar>
            <button
                pButton
                icon="pi pi-sign-out"
                class="p-button-rounded p-button-text p-button-secondary text-gray-400 hover:text-red-500"
                (click)="logout()"
                pTooltip="Выйти">
            </button>
          </div>

        </div>
      </header>

      <div class="bg-white border-b border-gray-200">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6">
          <p-tabMenu [model]="items" styleClass="custom-tabmenu border-none"></p-tabMenu>
        </div>
      </div>

      <main class="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 fade-in">
        <router-outlet></router-outlet>
      </main>

    </div>
  `,
  styles: [`
    .spin-slow { animation: spin 10s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    .fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

    /* Кастомизация TabMenu под стиль Tailwind */
    :host ::ng-deep .custom-tabmenu .p-tabmenu-nav {
      background: transparent;
      border: none;
    }
    :host ::ng-deep .custom-tabmenu .p-tabmenuitem .p-menuitem-link {
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: #6B7280; /* gray-500 */
      padding: 1rem 1.5rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    :host ::ng-deep .custom-tabmenu .p-tabmenuitem.p-highlight .p-menuitem-link {
      color: #2563EB; /* blue-600 */
      border-color: #2563EB;
      background: transparent;
    }
    :host ::ng-deep .custom-tabmenu .p-tabmenuitem .p-menuitem-link:hover {
      color: #111827; /* gray-900 */
      background: #F9FAFB;
    }
    :host ::ng-deep .custom-tabmenu .p-menuitem-icon {
      margin-right: 0.5rem;
    }
  `]
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  items: MenuItem[] = [
    { label: 'Заказы', icon: 'pi pi-shopping-bag', routerLink: '/admin/orders' },
    { label: 'Товары', icon: 'pi pi-box', routerLink: '/admin/products' },
    { label: 'Категории', icon: 'pi pi-list', routerLink: '/admin/categories' }
  ];

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
