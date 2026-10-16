import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public apiUrl = environment.apiUrl;

  roleSubject = new BehaviorSubject<string>('');
  userIdSubject = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/register`,
      user,
      {
        responseType: 'text'
      }
    );
  }

  login(login: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/api/login`,
      login
    ).pipe(
      tap(response => {

        localStorage.setItem('token', response.token);

        if (response.role) {
          this.roleSubject.next(response.role);
          localStorage.setItem('role', response.role);
        }

        if (response.userId) {
          this.userIdSubject.next(response.userId);
          localStorage.setItem('userId', response.userId.toString());
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');

    this.roleSubject.next('');
    this.userIdSubject.next(0);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRoleFromToken(): string {

    const token = localStorage.getItem('token');
  
    if (!token) {
      return '';
    }
  
    const decoded: any = jwtDecode(token);
  
    return (
      decoded.UserRole ||
      decoded.role ||
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      ''
    );
  }
  
  getUserIdFromToken(): string {
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      return '';
    }
  
    const decoded: any = jwtDecode(token);
    console.log(decoded);
  
    return (
      decoded.UserId ||
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      ''
    );
  }

  getUsernameFromToken(): string {

    const token = localStorage.getItem('token');
  
    if (!token) {
      return '';
    }
  
    const decoded: any = jwtDecode(token);
  
    return decoded.UserName || '';
  }
}