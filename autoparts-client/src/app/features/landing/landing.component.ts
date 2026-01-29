import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ProductDto } from '../../core/models/catalog.models';

import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonModule, CarouselModule, TagModule],
  template: `
    <div class="min-h-screen bg-[#F8F9FA] font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">

      <section class="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">

        <div class="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1920&auto=format&fit=crop"
            alt="Auto Background"
            class="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div class="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-[#F8F9FA]"></div>
        </div>

        <div class="relative z-10 text-center px-4 max-w-4xl w-full flex flex-col items-center">

          <div class="mb-8 fade-in-up" style="animation-delay: 0.1s;">
            <span class="py-1.5 px-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-blue-200 text-xs font-bold uppercase tracking-widest shadow-lg">
              🚀 Доставка за 24 часа
            </span>
          </div>

          <h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1] drop-shadow-2xl fade-in-up" style="animation-delay: 0.2s;">
            Найдите запчасти <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">быстро и точно</span>
          </h1>

          <p class="text-slate-300 text-lg md:text-xl mb-12 max-w-2xl font-light leading-relaxed fade-in-up" style="animation-delay: 0.3s;">
            Введите название детали или артикул (SKU).<br class="hidden md:block">
            Оригинальные запчасти и качественные аналоги в наличии.
          </p>

          <div class="w-full max-w-2xl fade-in-up relative z-20" style="animation-delay: 0.4s;">
            <div class="relative group">
              <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>

              <div class="relative bg-white/90 backdrop-blur-xl border border-white/50 p-2 rounded-2xl flex items-center shadow-2xl">
                <i class="pi pi-search text-gray-400 text-xl ml-4"></i>
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (keyup.enter)="onSearch()"
                  placeholder="Например: Масляный фильтр или 15208-65F0A"
                  class="flex-1 bg-transparent border-none outline-none px-4 py-4 text-gray-900 text-lg placeholder-gray-500 font-medium"
                />
                <button
                  (click)="onSearch()"
                  class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/50 active:scale-95"
                >
                  Найти
                </button>
              </div>
            </div>

            <div class="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-400">
              <span class="mt-1">Часто ищут:</span>
              <button (click)="quickSearch('Масло 5w40')" class="px-3 py-1 rounded-full border border-white/10 hover:bg-white/10 hover:text-white transition-colors cursor-pointer bg-white/5">Масло 5w40</button>
              <button (click)="quickSearch('Фильтр')" class="px-3 py-1 rounded-full border border-white/10 hover:bg-white/10 hover:text-white transition-colors cursor-pointer bg-white/5">Фильтры</button>
              <button (click)="quickSearch('Колодки')" class="px-3 py-1 rounded-full border border-white/10 hover:bg-white/10 hover:text-white transition-colors cursor-pointer bg-white/5">Тормозные колодки</button>
            </div>
          </div>
        </div>
      </section>

      <section class="py-12 px-6 relative z-30 -mt-20">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          <div class="bg-white/90 backdrop-blur p-8 rounded-3xl shadow-xl shadow-gray-200/50 hover:-translate-y-1 transition-transform duration-300 border border-white/50">
            <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
              <i class="pi pi-check-circle text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Точный подбор</h3>
            <p class="text-gray-500 text-sm leading-relaxed">Поиск по артикулу гарантирует 100% совместимость с вашим авто.</p>
          </div>

          <div class="bg-white/90 backdrop-blur p-8 rounded-3xl shadow-xl shadow-gray-200/50 hover:-translate-y-1 transition-transform duration-300 border border-white/50">
            <div class="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
              <i class="pi pi-truck text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Быстрая доставка</h3>
            <p class="text-gray-500 text-sm leading-relaxed">Отгружаем со склада в день заказа. Доставка курьером до двери.</p>
          </div>

          <div class="bg-white/90 backdrop-blur p-8 rounded-3xl shadow-xl shadow-gray-200/50 hover:-translate-y-1 transition-transform duration-300 border border-white/50">
            <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600">
              <i class="pi pi-wallet text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Честная цена</h3>
            <p class="text-gray-500 text-sm leading-relaxed">Работаем напрямую с дистрибьюторами. Никаких скрытых наценок.</p>
          </div>

        </div>
      </section>

      <section class="py-16">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex justify-between items-end mb-10">
            <div>
              <span class="text-blue-600 font-bold tracking-wider uppercase text-xs">Каталог</span>
              <h2 class="text-3xl font-extrabold text-gray-900 mt-2">Популярные категории</h2>
            </div>
            <a routerLink="/catalog" class="hidden md:flex items-center gap-2 text-gray-500 font-medium hover:text-blue-600 transition-colors text-sm">
              Весь каталог <i class="pi pi-arrow-right text-xs"></i>
            </a>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <a [routerLink]="['/catalog']" [queryParams]="{q: 'Масло'}" class="group relative h-64 md:h-80 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
              <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.allcarz.ru%2Fwp-content%2Fuploads%2F2024%2F10%2Ffoto-motornoe-maslo-kak-vybrat_01.jpg&f=1&nofb=1&ipt=29604b7f9bde51d25a3f31eb7c6bef1d668d5de896996aba93da465213f02bbb" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <h3 class="text-xl font-bold text-white">Масла</h3>
                <p class="text-blue-300 text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Перейти &rarr;</p>
              </div>
            </a>

            <a [routerLink]="['/catalog']" [queryParams]="{q: 'Фильтр'}" class="group relative h-64 md:h-80 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
              <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.CR6ruiQ_-i9YcX-45lSk9gHaE8%3Fpid%3DApi&f=1&ipt=3517fad84a17e75e811b4a965fdc9b7b2ff418528e75f93e3010b78b63e23ee7" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <h3 class="text-xl font-bold text-white">Фильтры</h3>
                <p class="text-blue-300 text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Перейти &rarr;</p>
              </div>
            </a>

            <a [routerLink]="['/catalog']" [queryParams]="{q: 'Аккумулятор'}" class="group relative h-64 md:h-80 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
              <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftj-service.ru%2Fwp-content%2Fuploads%2F2023%2F12%2Fphoto_2023-12-11_11-25-52.jpg&f=1&nofb=1&ipt=5522ab51b928c776ba7eac4e228ecc4676214eb5ad27d2c94e91ef3d8669346e" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <h3 class="text-xl font-bold text-white">Аккумуляторы</h3>
                <p class="text-blue-300 text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Перейти &rarr;</p>
              </div>
            </a>

             <a [routerLink]="['/catalog']" [queryParams]="{q: 'Шины'}" class="group relative h-64 md:h-80 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
              <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftaned.ru%2Fwp-content%2Fuploads%2F2023%2F01%2Fgalaxy-xd2010.jpg&f=1&nofb=1&ipt=47405149290782300086d45db4466474d8fd6393e5c829dddae874d6af2ab3b9" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <h3 class="text-xl font-bold text-white">Шины</h3>
                <p class="text-blue-300 text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Перейти &rarr;</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section class="py-16 bg-white border-y border-gray-100">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-extrabold text-gray-900">Хиты продаж</h2>
            <p class="text-gray-500 mt-2 max-w-xl mx-auto text-sm">Товары, которые чаще всего выбирают наши клиенты. Отличное соотношение цены и качества.</p>
          </div>

          <p-carousel
            [value]="featuredProducts"
            [numVisible]="4"
            [numScroll]="1"
            [circular]="true"
            [autoplayInterval]="4000"
            [responsiveOptions]="responsiveOptions"
            styleClass="custom-carousel"
          >
            <ng-template let-product pTemplate="item">
              <div class="p-3 h-full">
                <div class="bg-white rounded-2xl border border-gray-100 p-4 h-full flex flex-col relative hover:shadow-xl hover:shadow-blue-50 hover:border-blue-200 transition-all duration-300 group">

                  <div class="absolute top-4 left-4 z-10">
                    <span class="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">-15%</span>
                  </div>

                  <div class="h-48 flex items-center justify-center bg-gray-50 rounded-xl mb-4 overflow-hidden relative">
                    <img [src]="product.imageUrl || 'https://placehold.co/200?text=AutoParts'"
                         class="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 p-4">
                  </div>

                  <div class="mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Арт: {{ product.sku }}</div>
                  <h4 class="font-bold text-gray-800 text-base leading-snug mb-3 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors">
                    {{ product.name }}
                  </h4>

                  <div class="mt-auto flex items-end justify-between border-t border-gray-50 pt-3">
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-400 line-through">{{ product.price * 1.15 | number:'1.0-0' }} ₽</span>
                      <span class="text-xl font-extrabold text-gray-900">{{ product.price | number:'1.0-0' }} ₽</span>
                    </div>

                    <button
                      (click)="addToCart(product)"
                      class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <i class="pi pi-plus font-bold text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            </ng-template>
          </p-carousel>
        </div>
      </section>

      <section class="py-20 px-6">
        <div class="max-w-6xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-blue-900 relative overflow-hidden shadow-2xl shadow-blue-900/30">

          <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3"></div>
          <div class="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500 rounded-full blur-[100px] opacity-10 -translate-x-1/2 translate-y-1/2"></div>

          <div class="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-16 gap-10">
            <div class="text-center md:text-left max-w-xl">
              <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Зарегистрируйтесь и получите <br/> скидку на первый заказ
              </h2>
              <p class="text-blue-100 text-base mb-8 font-light">
                Создайте личный кабинет, чтобы сохранять историю заказов, отслеживать статус доставки и получать персональные предложения.
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button routerLink="/register" class="bg-white text-blue-900 font-bold py-3.5 px-8 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-white/20">
                  Создать аккаунт
                </button>
                <button routerLink="/login" class="bg-transparent border border-white/20 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-white/10 transition-colors">
                  Войти
                </button>
              </div>
            </div>

            <div class="hidden md:flex relative animate-float">
               <div class="w-40 h-40 bg-gradient-to-tr from-white/10 to-white/5 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-2xl transform rotate-6 hover:rotate-0 transition-all duration-500">
                 <i class="pi pi-user text-6xl text-blue-200"></i>
               </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    /* Анимации */
    .fade-in-up { opacity: 0; animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

    .animate-slow-zoom { animation: slowZoom 25s infinite alternate ease-in-out; }
    @keyframes slowZoom { from { transform: scale(1.0); } to { transform: scale(1.1); } }

    .animate-float { animation: float 6s ease-in-out infinite; }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

    /* Кастомизация карусели */
    ::ng-deep .custom-carousel .p-carousel-indicators { padding-top: 1.5rem; }
    ::ng-deep .custom-carousel .p-carousel-indicator button { background-color: #E2E8F0; width: 8px; height: 8px; border-radius: 50%; transition: all 0.3s; margin: 0 4px; }
    ::ng-deep .custom-carousel .p-carousel-indicator.p-highlight button { background-color: #3B82F6; transform: scale(1.5); }
  `]
})
export class LandingComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  searchQuery = '';
  featuredProducts: ProductDto[] = [];

  responsiveOptions = [
    { breakpoint: '1400px', numVisible: 4, numScroll: 1 },
    { breakpoint: '1100px', numVisible: 3, numScroll: 1 },
    { breakpoint: '768px', numVisible: 2, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ];

  ngOnInit() {
    this.productService.getAll().subscribe(data => {
      this.featuredProducts = data.slice(0, 8);
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/catalog'], { queryParams: { q: this.searchQuery } });
    }
  }

  quickSearch(term: string) {
    this.searchQuery = term;
    this.onSearch();
  }

  addToCart(product: ProductDto) {
    this.cartService.addToCart(product.id).subscribe({
      next: () => {
         this.messageService.add({ severity: 'success', summary: 'Добавлено', detail: `${product.name} в корзине` });
      }
    });
  }
}
