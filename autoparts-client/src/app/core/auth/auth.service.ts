import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, of, catchError } from 'rxjs';
import { AuthRequest, AuthResponse, RegisterRequest, User } from '../models/auth.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'auth_token';

  private http = inject(HttpClient);
  private router = inject(Router);

  currentUserSig = signal<User | null>(null);

  constructor() {
    if (this.getToken()) {
      this.getProfile().subscribe({
        error: () => this.logout()
      });
    }
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.getProfile().subscribe();
        this.router.navigate(['/']);
      })
    );
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.getProfile().subscribe();
        this.router.navigate(['/profile']);
      })
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        console.log('User loaded:', user);
        this.currentUserSig.set(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSig.set(null);
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    const payload = this.getPayload();
    console.log('Данные из токена:', payload);
    return payload?.role === 'ADMIN';
  }

   private getPayload(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Ошибка парсинга токена:', e);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
