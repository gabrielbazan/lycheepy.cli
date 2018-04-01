import { Routes, RouterModule } from '@angular/router';

import { ProcessesComponent } from './processes.component';
import { ProcessesListComponent } from './components/list';
import { ProcessesCreationComponent } from './components/creation';
// import { ProcessesEditionComponent } from './components/edition';
// import { ExecutionResultComponent } from './components/execution-result';


const routes: Routes = [
  {
    path: '',
    component: ProcessesComponent,
    children: [
      { path: '', component: ProcessesListComponent },
      { path: 'create', component: ProcessesCreationComponent },
//      { path: ':id', component: ProcessesEditionComponent }
    ],
  },
];

export const routing = RouterModule.forChild(routes);
