
import { Component, inject, OnInit, signal } from '@angular/core';
import { SuperAdminService, Tenant } from '../../../core/services/super-admin.service';

@Component({
  selector: 'app-super-admin',
  imports: [],
  templateUrl: './super-admin.html',
  styleUrl: './super-admin.css',
})
export class SuperAdmin implements OnInit {

  private superAdminService = inject(SuperAdminService);

  tenants = signal<Tenant[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadTenants();
  }

  loadTenants(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.superAdminService.getAllTenants().subscribe({
      next: (data) => {
        this.tenants.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load companies:', error);
        this.errorMessage.set('Unable to load companies.');
        this.isLoading.set(false);
      }
    });
  }
}
