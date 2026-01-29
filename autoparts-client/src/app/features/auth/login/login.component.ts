import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="min-h-screen flex w-full bg-white font-sans">
      <p-toast></p-toast>

      <div class="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative animate-fade-in-left">

        <a routerLink="/" class="absolute top-8 left-8 text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2 font-medium">
           <i class="pi pi-arrow-left"></i> На главную
        </a>

        <div class="w-full max-w-md space-y-8">
          <div class="text-center md:text-left">
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">С возвращением!</h1>
            <p class="mt-2 text-gray-500">Введите телефон и пароль для входа в кабинет.</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">

            <div class="space-y-5">

              <div>
                <label for="phone" class="block text-sm font-bold text-gray-700 mb-2">Номер телефона</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i class="pi pi-phone text-gray-400"></i>
                  </div>
                  <input
                    pInputText
                    id="phone"
                    formControlName="phone"
                    placeholder="+7 777 000 00 00"
                    class="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    [ngClass]="{'border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-200': isFieldInvalid('phone')}"
                  />
                </div>
                <small *ngIf="isFieldInvalid('phone')" class="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                   <i class="pi pi-info-circle"></i> Введите корректный номер
                </small>
              </div>

              <div>
                <div class="flex items-center justify-between mb-2">
                   <label for="password" class="block text-sm font-bold text-gray-700">Пароль</label>
                   <a href="#" class="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">Забыли пароль?</a>
                </div>

                <p-password
                  id="password"
                  formControlName="password"
                  [feedback]="false"
                  [toggleMask]="true"
                  styleClass="w-full"
                  inputStyleClass="w-full pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  placeholder="••••••••"
                  [ngClass]="{'ng-invalid-custom': isFieldInvalid('password')}"
                ></p-password>

                 <small *ngIf="isFieldInvalid('password')" class="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                    <i class="pi pi-info-circle"></i> Введите пароль
                 </small>
              </div>
            </div>

            <button
              type="submit"
              [disabled]="isLoading"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <i *ngIf="isLoading" class="pi pi-spin pi-spinner"></i>
              {{ isLoading ? 'Вход...' : 'Войти в аккаунт' }}
            </button>

            <div class="relative my-8">
               <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200"></div></div>
               <div class="relative flex justify-center text-sm"><span class="px-4 bg-white text-gray-500 font-medium">или</span></div>
            </div>

            <p class="text-center text-sm text-gray-600">
              Нет аккаунта?
              <a routerLink="/register" class="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all cursor-pointer">
                Зарегистрироваться бесплатно
              </a>
            </p>
          </form>
        </div>
      </div>

      <div class="hidden lg:block relative w-0 flex-1 bg-gray-900">
         <img class="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay" src="https://images.unsplash.com/photo-1493238792015-153296bc86d5?q=80&w=1920&auto=format&fit=crop" alt="Car background">
         <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/80 to-slate-900"></div>

         <div class="absolute inset-0 flex flex-col justify-center px-16 text-white">
            <h2 class="text-5xl font-black mb-8 leading-tight tracking-tight">Ваш автомобиль <br>заслуживает <span class="text-blue-400">лучшего</span></h2>
            <p class="text-xl text-blue-100 max-w-lg leading-relaxed font-light">
               Более 50,000 запчастей в каталоге. Быстрая доставка, гарантия качества и персональные скидки.
            </p>

            <div class="mt-12 flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl w-fit border border-white/10">
               <div class="flex -space-x-3">
                  <img class="w-10 h-10 rounded-full border-2 border-slate-800" src="https://randomuser.me/api/portraits/men/32.jpg" alt=""/>
                  <img class="w-10 h-10 rounded-full border-2 border-slate-800" src="https://randomuser.me/api/portraits/women/44.jpg" alt=""/>
                  <img class="w-10 h-10 rounded-full border-2 border-slate-800" src="https://randomuser.me/api/portraits/men/86.jpg" alt=""/>
               </div>
               <div class="text-sm font-medium">
                  <span class="block text-white font-bold">10k+ довольных</span>
                  <span class="text-blue-200">клиентов по всей стране</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-left { animation: fadeInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }

    /* Кастомный класс для p-password при ошибке */
    :host ::ng-deep .ng-invalid-custom input {
        border-color: #fca5a5; /* red-300 */
        background-color: #fef2f2; /* red-50 */
        color: #7f1d1d;
    }
    :host ::ng-deep .ng-invalid-custom input::placeholder {
        color: #fca5a5;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  isLoading = false;

  loginForm = this.fb.group({
    phone: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { phone, password } = this.loginForm.value;

      this.authService.login({ phone: phone!, password: password! }).subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка входа',
            detail: 'Неверный телефон или пароль'
          });
        }
      });
    } else {
        this.loginForm.markAllAsTouched();
    }
  }
}
