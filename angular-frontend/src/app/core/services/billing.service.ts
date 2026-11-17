
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Subscription {
  plan: string;
  status: string;
  billingCycle: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface Invoice {
  id: number;
  tenantName: string;
  baseAmount: number;
  usageAmount: number;
  totalAmount: number;
  apiCallCount: number;
  status: string;
  periodStart: string;
  periodEnd: string;
  issuedAt: string;
}

export interface PaymentMethod {
  cardBrand: string;
  cardLastFour: string;
  addedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/billing`;

  getSubscription(): Observable<Subscription> {
    return this.http.get<Subscription>(
      `${this.apiUrl}/subscription`
    );
  }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(
      `${this.apiUrl}/invoices`
    );
  }

  getPaymentMethod(): Observable<PaymentMethod> {
    return this.http.get<PaymentMethod>(
      `${this.apiUrl}/payment-method`
    );
  }

}
