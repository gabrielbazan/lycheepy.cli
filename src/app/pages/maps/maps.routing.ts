import { Routes, RouterModule } from '@angular/router';

import { Maps } from './maps.component';
import { LeafletMaps } from './components/leafletMaps/leafletMaps.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Maps,
    children: [
      { path: 'leafletmaps', component: LeafletMaps },
    ],
  },
];

export const routing = RouterModule.forChild(routes);
