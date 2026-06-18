import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environment/env';

@Injectable({ providedIn: 'root' })
export class Login {
  private api = `${environment.API_URL}/auth`;

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string) {
    return this.http.post(`${this.api}/login`, { email, password });
  }

  saveSession(res: any) {
    const user = res?.user || {};

    localStorage.setItem('token', res?.token || '');
    localStorage.setItem('role', user.role || '');
    localStorage.setItem('userId', user._id || user.id || '');
    localStorage.setItem('userEmail', user.email || '');
    localStorage.setItem('userName', user.name || '');
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('user');
    localStorage.removeItem('adminId');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }

  get role() {
    return localStorage.getItem('role');
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    return !!token && !this.isTokenExpired(token);
  }

  getCurrentUser() {
    const email = localStorage.getItem('userEmail') || '';
    const name = localStorage.getItem('userName') || '';
    const role = localStorage.getItem('role') || '';
    const id = localStorage.getItem('userId') || '';

    if (email || name || role || id) {
      return { email, name, role, id };
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        email: user.email || '',
        name: user.name || '',
        role: user.role || '',
        id: user._id || user.id || ''
      };
    } catch {
      return { email: '', name: '', role: '', id: '' };
    }
  }

  clearInvalidSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('user');
  }

  private isTokenExpired(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }

  sendResetLink(email: string) {
    return this.http.post(`${this.api}/forgotPassword`, { email: email });
  }

  resetPassword(token: string, password: string) {
    return this.http.post(`${this.api}/resetPassword`, {
      token: token,
      password: password
    });
  }

}
