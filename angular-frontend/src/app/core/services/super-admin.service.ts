
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Tenant {
  id: number;
  name: string;
  plan: string;
  status: string;
  userCount: number;
  apiCallCount: number;
  createdAt: string;
}

export interface CompanyDetails {
  id: number;
  name: string;
  plan: string;
  status: string;
  createdAt: string;
  userCount: number;
  apiCallCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/superadmin`;

  // Fetch all companies
  getAllTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(`${this.apiUrl}/tenants`);
  }

  // Fetch details of a specific company
  getCompanyDetails(id: number): Observable<CompanyDetails> {
    return this.http.get<CompanyDetails>(
      `${this.apiUrl}/company/${id}`
    );
  }
}
