import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';


export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule',
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule',
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'chains', pathMatch: 'full' },
      { path: 'chains', loadChildren: './chains/chains.module#ChainsModule' },
      { path: 'processes', loadChildren: './processes/processes.module#ProcessesModule' }
    ],
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
