import { Routes, RouterModule } from '@angular/router';

import { ChainsComponent } from './chains.component';
import { ChainsListComponent } from './components/list/list.component';
import { ChainsEditionComponent } from './components/edition/edition.component';
import { ExecutionResultComponent } from './components/execution-result/execution-result.component';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: ChainsComponent,
    children: [
      { path: '', component: ChainsListComponent },
      { path: ':id', component: ChainsEditionComponent },
      { path: ':id/executions/:executionId', component: ExecutionResultComponent },
    ],
  },
];

export const routing = RouterModule.forChild(routes);
