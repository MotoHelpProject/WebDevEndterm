import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, Transport, User } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private api = 'http://localhost:8000/api';

  register(data: { username: string; email: string; password: string; phone?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/register/`, data).pipe(
      tap((res) => {
        localStorage.setItem('token', res.access);
        localStorage.setItem('refresh', res.refresh);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  login(data: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/login/`, data).pipe(
      tap((res) => {
        localStorage.setItem('token', res.access);
        localStorage.setItem('refresh', res.refresh);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.api}/auth/me/`);
  }

  logout() {
    const refresh = typeof localStorage !== 'undefined' ? localStorage.getItem('refresh') : null;
    if (refresh) {
      this.http.post(`${this.api}/auth/logout/`, { refresh }).subscribe({ error: () => {} });
    }
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  }

  getUser(): User | null {
    if (typeof localStorage === 'undefined') return null;
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  updateLocation(lat: number, lon: number): Observable<{ status: string }> {
    return this.http.patch<{ status: string }>(`${this.api}/auth/me/location/`, { latitude: lat, longitude: lon });
  }

  saveTransport(data: Partial<Transport>): Observable<Transport> {
    return this.http.post<Transport>(`${this.api}/auth/transport/`, data);
  }

  getTransport(): Observable<Transport | null> {
    return this.http.get<Transport | null>(`${this.api}/auth/transport/`);
  }
}
