import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/auth/auth.service';

import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AvatarModule,
    TooltipModule
  ],
  template: `
    <header class="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-6">

        <a routerLink="/" class="flex items-center gap-2 group cursor-pointer no-underline">
          <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <i class="pi pi-cog text-xl spin-slow"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-extrabold text-gray-900 tracking-tight leading-none">AutoParts</span>
            <span class="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Store</span>
          </div>
        </a>

        <div class="hidden md:flex flex-1 max-w-xl relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i class="pi pi-search text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
          </div>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
            class="block w-full pl-11 pr-4 py-3 bg-gray-100 border-none rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all shadow-inner"
            placeholder="Поиск запчастей (название, артикул)..."
          >
          <button
            (click)="onSearch()"
            class="absolute right-2 top-2 bottom-2 bg-white shadow-sm text-gray-500 hover:text-blue-600 px-3 rounded-xl transition-all hover:shadow-md text-sm font-medium"
          >
            Найти
          </button>
        </div>

        <div class="flex items-center gap-2 sm:gap-4">

          <button
            routerLink="/cart"
            class="relative w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors group"
          >
            <i class="pi pi-shopping-cart text-xl group-hover:text-blue-600 transition-colors"></i>
            <span *ngIf="cartCount() > 0" class="absolute top-2 right-2 flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </button>

          <div class="h-8 w-px bg-gray-200"></div>

          <ng-container *ngIf="authService.currentUserSig(); else loginBtn">

            <button
              *ngIf="isAdmin"
              routerLink="/admin"
              class="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-purple-50 text-purple-600 transition-colors"
              pTooltip="Админ-панель"
              tooltipPosition="bottom"
            >
              <i class="pi pi-cog text-xl"></i>
            </button>

            <div
              routerLink="/profile"
              class="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
            >
              <p-avatar icon="pi pi-user" shape="circle" styleClass="bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md"></p-avatar>
              <div class="hidden lg:flex flex-col items-start">
                <span class="text-xs text-gray-500 font-medium">Мой кабинет</span>
                <span class="text-sm font-bold text-gray-800 leading-none">Профиль</span>
              </div>
            </div>

            <button
              (click)="onLogout()"
              class="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              pTooltip="Выйти"
            >
              <i class="pi pi-sign-out"></i>
            </button>

          </ng-container>

          <ng-template #loginBtn>
            <a routerLink="/login" class="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">Войти</a>
            <a routerLink="/register" class="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-gray-900/20 hover:bg-gray-800 hover:scale-105 transition-all">
              Регистрация
            </a>
          </ng-template>

        </div>
      </div>
    </header>
  `,
  styles: [`
    .spin-slow {
      animation: spin 10s linear infinite;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `]
})
export class HeaderComponent implements OnInit {
  searchQuery = '';
  @Output() search = new EventEmitter<string>();

  public cartService = inject(CartService);
  public authService = inject(AuthService);
  public router = inject(Router);

  cartCount = this.cartService.cartCountSig;

  ngOnInit() {
    this.cartService.getCart().subscribe();
  }

  onSearch() {
    this.router.navigate(['/catalog'], { queryParams: { q: this.searchQuery } });
    this.search.emit(this.searchQuery);
  }

  get isAdmin() {
    return this.authService.isAdmin();
  }

  onLogout() {
    this.authService.logout();
  }
}
