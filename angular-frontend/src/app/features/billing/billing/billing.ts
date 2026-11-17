
import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
  BillingService,
  Subscription,
  Invoice
} from '../../../core/services/billing.service';

@Component({
  selector: 'app-billing',
  imports: [DatePipe],
  templateUrl: './billing.html',
  styleUrl: './billing.css',
})
export class Billing implements OnInit {

  private billingService = inject(BillingService);

  subscription = signal<Subscription | null>(null);

  invoices = signal<Invoice[]>([]);

  isLoading = signal(true);

  errorMessage = signal('');

  ngOnInit(): void {
    this.loadBillingData();
  }

  loadBillingData(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.billingService.getSubscription().subscribe({

      next: (data) => {
        console.log('Subscription received:', data);

        this.subscription.set(data);
        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Subscription error:', error);

        this.errorMessage.set(
          'Unable to load subscription details.'
        );

        this.isLoading.set(false);
      }

    });

    this.billingService.getInvoices().subscribe({

      next: (data) => {
        this.invoices.set(data);
      },

      error: (error) => {
        console.error('Invoice error:', error);
      }

    });

  }
}
