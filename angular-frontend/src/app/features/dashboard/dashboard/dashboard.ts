
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private authService = inject(AuthService);

  user = this.authService.user;

}
