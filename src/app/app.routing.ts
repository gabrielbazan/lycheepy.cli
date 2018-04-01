import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'chains', redirectTo: 'pages/chains' },
  { path: 'processes', redirectTo: 'pages/processes' },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
