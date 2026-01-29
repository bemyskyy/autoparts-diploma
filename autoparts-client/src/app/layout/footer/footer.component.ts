import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div class="col-span-1 md:col-span-1">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <i class="pi pi-cog spin-slow"></i>
              </div>
              <span class="text-xl font-extrabold text-gray-900 tracking-tight">AutoParts</span>
            </div>
            <p class="text-gray-500 text-sm leading-relaxed">
              Лучший магазин автозапчастей. Качество, гарантия и быстрая доставка по всей стране.
            </p>
          </div>

          <div>
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Магазин</h3>
            <ul class="space-y-3">
              <li><a routerLink="/" class="text-gray-500 hover:text-blue-600 text-sm transition-colors">Главная</a></li>
              <li><a routerLink="/catalog" class="text-gray-500 hover:text-blue-600 text-sm transition-colors">Каталог</a></li>
              <li><a routerLink="/cart" class="text-gray-500 hover:text-blue-600 text-sm transition-colors">Корзина</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Клиентам</h3>
            <ul class="space-y-3">
              <li><a routerLink="/profile" class="text-gray-500 hover:text-blue-600 text-sm transition-colors">Личный кабинет</a></li>
              <li><a href="#" class="text-gray-500 hover:text-blue-600 text-sm transition-colors">Доставка и оплата</a></li>
              <li><a href="#" class="text-gray-500 hover:text-blue-600 text-sm transition-colors">Возврат товара</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Контакты</h3>
            <ul class="space-y-3 text-sm text-gray-500">
              <li class="flex items-center gap-2">
                <i class="pi pi-phone text-blue-500"></i>
                <span>+7 (777) 123-45-67</span>
              </li>
              <li class="flex items-center gap-2">
                <i class="pi pi-envelope text-blue-500"></i>
                <span>support@autoparts.com</span>
              </li>
              <li class="flex items-center gap-2">
                <i class="pi pi-map-marker text-blue-500"></i>
                <span>г. Самара, ул. Николая Панова 64</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-gray-400 text-sm">© 2026 AutoParts Store. Все права защищены.</p>
          <div class="flex gap-4">
            <i class="pi pi-facebook text-gray-400 hover:text-blue-600 cursor-pointer text-lg transition-colors"></i>
            <i class="pi pi-instagram text-gray-400 hover:text-pink-600 cursor-pointer text-lg transition-colors"></i>
            <i class="pi pi-telegram text-gray-400 hover:text-blue-400 cursor-pointer text-lg transition-colors"></i>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .spin-slow { animation: spin 12s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `]
})
export class FooterComponent {}
