
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

export interface User {
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  companyName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSignal = signal<User | null>(
    this.getSavedUser()
  );

  user = this.userSignal.asReadonly();

  isAuthenticated = computed(() => !!this.userSignal());

  isSuperAdmin = computed(
    () => this.userSignal()?.role === 'SUPER_ADMIN'
  );

  isAdmin = computed(() => {
    const role = this.userSignal()?.role;
    return role === 'ADMIN' || role === 'SUPER_ADMIN';
  });


getTenantNames(): Observable<string[]> {
  return this.http.get<string[]>(
    `${environment.apiUrl}/api/superadmin/tenant-names`
  );
}

registerWithApi(data: {
  name: string;
  email: string;
  password: string;
  companyName: string;
}): Observable<any> {
  return this.http.post<any>(
    `${environment.apiUrl}/api/auth/register`,
    data
  );
}


  login(userData: User, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    this.userSignal.set(userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.userSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getSavedUser(): User | null {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser) as User;
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  }

  private http = inject(HttpClient);

loginWithApi(credentials: {
  email: string;
  password: string;
}): Observable<any> {

  return this.http.post<any>(
    `${environment.apiUrl}/api/auth/login`,
    credentials
  ).pipe(
    tap(response => {
      const userData: User = {
        name: response.name,
        email: response.email,
        role: response.role,
        companyName: response.companyName
      };

      this.login(userData, response.token);
    })
  );
}
}
