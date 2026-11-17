
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required
    ])
  });

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    this.authService.loginWithApi(credentials).subscribe({

      next: (response) => {
  this.isLoading = false;
  this.router.navigate(['/dashboard']);
},

      error: (err) => {

        this.isLoading = false;

        this.errorMessage =
          err.error?.error ||
          err.error?.message ||
          'Login failed. Check your credentials.';
      }

    });
  }
}
