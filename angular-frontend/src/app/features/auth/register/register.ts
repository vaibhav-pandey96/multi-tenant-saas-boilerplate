
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  isNewCompany = true;
  existingCompanies: string[] = [];
  selectedCompany = '';

  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),

    companyName: new FormControl('', Validators.required)
  });

ngOnInit(): void {
  this.authService.getTenantNames().subscribe({
    next: (companies) => {
      this.existingCompanies = companies;
    },
    error: (error) => {
      console.error('Failed to load companies:', error);
    }
  });
}


  onSubmit(): void {
    // Step 1: Validate the form
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Step 2: Start loading
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Step 3: Prepare registration data
    const registrationData = {
      name: this.registerForm.value.name!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      companyName: this.registerForm.value.companyName!
    };

    // Step 4: Call Spring Boot API

    this.authService.registerWithApi(registrationData).subscribe({

      next: (response) => {
        this.isLoading = false;

        this.successMessage =
          'Registration successful! You can now login.';

        this.errorMessage = '';
        this.registerForm.reset();
      },

      error: (err) => {
        this.isLoading = false;

        this.errorMessage =
          err.error?.error ||
          err.error?.message ||
          'Registration failed. Please try again.';

        this.successMessage = '';
      }

    });

  }


}
