
import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  // Public routes
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },

  {
  path: 'register',
  loadComponent: () =>
    import('./features/auth/register/register').then(m => m.Register)
},

  // Protected routes
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
    path: 'billing',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/billing/billing/billing')
        .then(m => m.Billing)
  },

  // Admin only
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/admin/admin')
        .then(m => m.Admin)
  },

  // Super Admin only
  {
    path: 'superadmin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./features/super-admin/super-admin/super-admin')
        .then(m => m.SuperAdmin)
  },

  {
    path: 'superadmin/company/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./features/super-admin/company-details/company-details/company-details')
        .then(m => m.CompanyDetails)
  },

  // Default route
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Unknown routes
  {
    path: '**',
    redirectTo: 'login'
  }

];