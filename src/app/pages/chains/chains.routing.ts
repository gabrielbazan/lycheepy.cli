import { Routes, RouterModule } from '@angular/router';

import { ChainsComponent } from './chains.component';
import { ChainsListComponent } from './components/list/list.component';
import { ChainsDetailComponent } from './components/detail/detail.component';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: ChainsComponent,
    children: [
      { path: '', component: ChainsListComponent },
      { path: ':id', component: ChainsDetailComponent },
    ],
  },
];

export const routing = RouterModule.forChild(routes);
