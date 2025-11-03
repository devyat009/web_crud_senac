import { Routes } from '@angular/router';
import { profileCompleteGuard } from './shared/guards/profile-complete.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [profileCompleteGuard],
    loadComponent: () => import('./modules/pages/home/home.component').then((m) => m.HomeComponent)

  },
  {
    path: 'perfil',
    loadComponent: () => import('./modules/pages/perfil/perfil.component').then((m) => m.PerfilComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'home',
    canActivate: [profileCompleteGuard],
    loadComponent: () => import('./modules/pages/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'clientes',
    canActivate: [profileCompleteGuard],
    loadComponent: () => import('./modules/pages/clientes/clientes.component').then((m) => m.ClientesComponent)
  },
  {
    path: 'produtos',
    canActivate: [profileCompleteGuard],
    loadComponent: () => import('./modules/pages/produtos/produtos.component').then((m) => m.ProdutosComponent)
  },
  {
    path: 'produtos',
    canActivate: [profileCompleteGuard],
    loadComponent: () => import('./modules/pages/produtos/produtos.component').then((m) => m.ProdutosComponent)
  },
  {
    path: 'admin',
    canActivate: [profileCompleteGuard],
    loadComponent: () => import('./modules/pages/admin/admin.component').then((m) => m.AdminComponent)
  },
  {
    path: 'not-found',
    loadComponent: () => import('./modules/pages/not-found/not-found.component').then((c) => c.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '/not-found'
  }
];
