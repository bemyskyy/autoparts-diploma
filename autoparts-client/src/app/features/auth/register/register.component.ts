import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    DividerModule
  ],
  providers: [MessageService],
  template: `
    <div class="min-h-screen flex w-full bg-white font-sans">
      <p-toast></p-toast>

      <div class="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative animate-fade-in-left">

         <a routerLink="/" class="absolute top-8 left-8 text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2 font-medium">
           <i class="pi pi-arrow-left"></i> На главную
        </a>

        <div class="w-full max-w-lg">
          <div class="mb-10">
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Создание аккаунта</h1>
            <p class="mt-3 text-gray-500 text-lg">Заполните данные, чтобы получить доступ к истории заказов.</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-6">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="flex flex-col gap-2">
                <label for="firstName" class="text-sm font-bold text-gray-700">Имя <span class="text-red-500">*</span></label>
                <input
                    pInputText
                    id="firstName"
                    formControlName="firstName"
                    placeholder="Иван"
                    class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    [ngClass]="{'border-red-300 bg-red-50': isFieldInvalid('firstName')}"/>
              </div>

              <div class="flex flex-col gap-2">
                <label for="lastName" class="text-sm font-bold text-gray-700">Фамилия</label>
                <input
                    pInputText
                    id="lastName"
                    formControlName="lastName"
                    placeholder="Иванов"
                    class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label for="phone" class="text-sm font-bold text-gray-700">Телефон (Логин) <span class="text-red-500">*</span></label>
              <div class="relative">
                 <i class="pi pi-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                 <input
                    pInputText
                    id="phone"
                    formControlName="phone"
                    placeholder="+79990000000"
                    class="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    [ngClass]="{'border-red-300 bg-red-50': isFieldInvalid('phone')}"/>
              </div>

              <div *ngIf="isFieldInvalid('phone')" class="flex flex-col gap-1">
                <small *ngIf="registerForm.get('phone')?.hasError('required')" class="text-red-500 text-xs font-medium">
                    Это поле обязательно
                </small>
                <small *ngIf="registerForm.get('phone')?.hasError('pattern')" class="text-red-500 text-xs font-medium">
                    Введите корректный российский номер: +79xxxxxxxxx
                </small>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label for="password" class="text-sm font-bold text-gray-700">Пароль <span class="text-red-500">*</span></label>
              <p-password
                id="password"
                formControlName="password"
                [toggleMask]="true"
                [feedback]="true"
                styleClass="w-full"
                inputStyleClass="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                placeholder="Минимум 6 символов"
                [ngClass]="{'ng-invalid-custom': isFieldInvalid('password')}"
                promptLabel="Придумайте надежный пароль"
                weakLabel="Слабый"
                mediumLabel="Нормальный"
                strongLabel="Отличный"
              ></p-password>
              <small *ngIf="isFieldInvalid('password')" class="text-red-500 text-xs font-medium">Минимум 4 символа</small>
            </div>

            <div class="my-2 p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 text-sm flex gap-3 items-start">
               <i class="pi pi-shield mt-0.5 text-blue-600"></i>
               <p class="leading-relaxed">Ваши данные надежно защищены. Мы не передаем их третьим лицам.</p>
            </div>

            <button
              type="submit"
              [disabled]="isLoading"
              class="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 px-8 rounded-xl shadow-xl shadow-gray-900/10 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <i *ngIf="isLoading" class="pi pi-spin pi-spinner"></i>
              {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
            </button>

            <p class="text-center mt-2 text-sm text-gray-600">
              Уже есть аккаунт?
              <a routerLink="/login" class="font-bold text-blue-600 hover:text-blue-800 transition-colors">
                Войти
              </a>
            </p>
          </form>
        </div>
      </div>

      <div class="hidden lg:block relative w-0 flex-1 bg-gray-900">
         <img class="absolute inset-0 h-full w-full object-cover opacity-80" src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop" alt="Register background">
         <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

         <div class="absolute bottom-0 left-0 right-0 p-20 text-white">
            <div class="mb-8">
               <i class="pi pi-star-fill text-yellow-400 text-2xl"></i>
               <i class="pi pi-star-fill text-yellow-400 text-2xl ml-1"></i>
               <i class="pi pi-star-fill text-yellow-400 text-2xl ml-1"></i>
               <i class="pi pi-star-fill text-yellow-400 text-2xl ml-1"></i>
               <i class="pi pi-star-fill text-yellow-400 text-2xl ml-1"></i>
            </div>
            <blockquote class="text-3xl font-bold leading-snug mb-6">
               "Я всегда покупаю запчасти только здесь. Отличный сервис и быстрая доставка."
            </blockquote>
            <div class="flex items-center gap-4">
               <div class="w-14 h-14 rounded-full border-2 border-white/20 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" class="w-full h-full object-cover">
               </div>
               <div>
                  <div class="font-bold text-lg">Алексей Петров</div>
                  <div class="text-sm text-blue-200">Постоянный клиент</div>
               </div>
            </div>
         </div>
      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in-left { animation: fadeInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }

    :host ::ng-deep .ng-invalid-custom input {
        border-color: #fca5a5;
        background-color: #fef2f2;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  isLoading = false;

  private readonly RUS_PHONE_REGEX = /^\+7\d{10}$/;

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    phone: ['', [Validators.required, Validators.pattern(this.RUS_PHONE_REGEX)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const request = {
        firstName: this.registerForm.value.firstName!,
        lastName: this.registerForm.value.lastName || '',
        phone: this.registerForm.value.phone!,
        password: this.registerForm.value.password!
      };

      this.authService.register(request).subscribe({
        next: () => {
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Успешно', detail: 'Аккаунт создан! Перенаправление...' });
          setTimeout(() => this.router.navigate(['/']), 1000);
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Возможно, такой пользователь уже существует'
          });
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
