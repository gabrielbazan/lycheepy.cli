import { Routes, RouterModule } from '@angular/router';

import { ChainsComponent } from './chains.component';
import { ChainsListComponent } from './components/list';
import { ChainsCreationComponent } from './components/creation';
import { ChainsEditionComponent } from './components/edition';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: ChainsComponent,
    children: [
      { path: '', component: ChainsListComponent },
      { path: 'create', component: ChainsCreationComponent },
      { path: ':id', component: ChainsEditionComponent },
    ],
  },
];

export const routing = RouterModule.forChild(routes);
