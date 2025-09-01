import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modules/pages/home/home.component').then((m) => m.HomeComponent)

  },
  {
    path: 'login',
    loadComponent: () => import('./modules/pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./modules/pages/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'clientes',
    loadComponent: () => import('./modules/pages/clientes/clientes.component').then((m) => m.ClientesComponent)
  },
  {
    path: 'produtos',
    loadComponent: () => import('./modules/pages/produtos/produtos.component').then((m) => m.ProdutosComponent)
  },
  {
    path: 'produtos',
    loadComponent: () => import('./modules/pages/produtos/produtos.component').then((m) => m.ProdutosComponent)
  },
  {
    path: 'admin',
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
