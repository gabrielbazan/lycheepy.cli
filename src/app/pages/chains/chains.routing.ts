import { Routes, RouterModule } from '@angular/router';

import { ChainsComponent } from './chains.component';
import { ChainsListComponent } from './components/list/list.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: ChainsComponent,
    children: [
      { path: 'list', component: ChainsListComponent },
    ],
  },
];

export const routing = RouterModule.forChild(routes);
