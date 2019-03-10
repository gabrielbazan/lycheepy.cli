import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

import { ListComponent as RepositoriesListComponent } from './repositories/list/list.component';
import { AddComponent as RepositoriesAddComponent } from './repositories/add/add.component';
import { EditComponent as RepositoriesEditComponent } from './repositories/edit/edit.component';

import { ListComponent as ProcessesListComponent } from './processes/list/list.component';
import { AddComponent as ProcessesAddComponent } from './processes/add/add.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'repositories',
    component: RepositoriesListComponent,
  }, {
    path: 'add-repository',
    component: RepositoriesAddComponent,
  }, {
    path: 'repository/:id',
    component: RepositoriesEditComponent,
  }, {
    path: 'processes',
    component: ProcessesListComponent,
  }, {
    path: 'add-process',
    component: ProcessesAddComponent,
  }, {
    path: 'miscellaneous',
    loadChildren: './miscellaneous/miscellaneous.module#MiscellaneousModule',
  }, {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '**',
    component: NotFoundComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
