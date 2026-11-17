
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  companyName: string;
  plan: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/admin`;

  getUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(
      `${this.apiUrl}/users`
    );
  }

  getUserById(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      `${this.apiUrl}/users/${id}`
    );
  }

  transferAdminRights(id: number): Observable<UserProfile> {
    return this.http.put<UserProfile>(
      `${this.apiUrl}/transfer-admin/${id}`,
      {}
    );
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete(
      `${this.apiUrl}/users/${id}`,
      { responseType: 'text' }
    );
  }
}
