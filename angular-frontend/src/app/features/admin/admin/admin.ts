
import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService, UserProfile } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {

  private adminService = inject(AdminService);

  users = signal<UserProfile[]>([]);

  isLoading = signal(true);

  errorMessage = signal('');

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.adminService.getUsers().subscribe({

      next: (data) => {
        console.log('Company users:', data);

        this.users.set(data);
        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Failed to load users:', error);

        this.errorMessage.set(
          'Unable to load company users.'
        );

        this.isLoading.set(false);
      }

    });

  }

}
