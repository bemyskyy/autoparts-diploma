import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { CatalogComponent } from './features/catalog/catalog.component';
import { CartComponent } from './features/cart/cart.component';
import { ProfileComponent } from './features/profile/profile.component';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';
import { AdminCategoriesComponent } from './features/admin/categories/admin-categories.component';
import { AdminProductsComponent } from './features/admin/products/admin-products.component';
import { AdminOrdersComponent } from './features/admin/orders/admin-orders.component';
import { LandingComponent } from './features/landing/landing.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Вход',
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Регистрация',
    canActivate: [guestGuard]
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'orders', component: AdminOrdersComponent, title: 'Управление заказами' },
      { path: 'products', component: AdminProductsComponent, title: 'Управление товарами' },
      { path: 'categories', component: AdminCategoriesComponent, title: 'Управление категориями' },
      { path: '', redirectTo: 'orders', pathMatch: 'full' }
    ]
  },

  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Мои заказы'
  },

  {
    path: 'cart',
    component: CartComponent,
    title: 'Корзина'
  },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: LandingComponent, title: 'AutoParts - Главная' },
      { path: 'catalog', component: CatalogComponent, title: 'Каталог запчастей' }
    ]
  },

  { path: '**', redirectTo: '' }
];
