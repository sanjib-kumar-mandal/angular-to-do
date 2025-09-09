import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/home/home').then((m) => m.Home),
  },
  {
    path: 'authentication',
    children: [
      {
        path: 'login',
        data: { rootId: 'login' },
        loadComponent: () =>
          import('@pages/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        data: { rootId: 'register' },
        loadComponent: () =>
          import('@pages/auth/register/register').then((m) => m.Register),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('@pages/auth/forgot-password/forgot-password').then(
            (m) => m.ForgotPassword
          ),
      },
    ],
  },
  {
    path: 'about',
    loadComponent: () => import('@pages/about/about').then((m) => m.About),
  },
  {
    path: 'my-profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@pages/my-profile/my-profile').then((m) => m.MyProfile),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('@pages/dashboard/tasks/tasks').then((m) => m.Tasks),
      },
    ],
  },
];
