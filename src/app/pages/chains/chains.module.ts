import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { routing } from './chains.routing';
import { ChainsComponent } from './chains.component';
import { ChainsListComponent } from './components/list';
import { ChainsCreationComponent } from './components/creation';
import { ChainsEditionComponent } from './components/edition';

import { ChainsService } from '../../services/chains.service';
import { ExecutionsService } from '../../services/executions.service';
import { ProcessesService } from '../../services/processes.service';

import { WpsService } from '../../services/wps.service';

import { ExecutionModal } from './components/execution/execution.component';
import { AddProcess } from './components/add-process/add-process.component';

import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { DynamicFormsBootstrapUIModule } from '@ng-dynamic-forms/ui-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { TagInputModule } from 'ngx-chips';

import { NguiAutoCompleteModule } from '@ngui/auto-complete';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    NgbModalModule,
    DynamicFormsCoreModule.forRoot(),
    DynamicFormsBootstrapUIModule,
    ReactiveFormsModule,
    TagInputModule,
    NguiAutoCompleteModule
  ],
  declarations: [
    ChainsComponent,
    ChainsListComponent,
    ChainsEditionComponent,
    ChainsCreationComponent,
    ExecutionModal,
    AddProcess,
  ],
  providers: [
    ChainsService,
    WpsService,
    ExecutionsService,
    ProcessesService,
  ],
  entryComponents: [ExecutionModal, AddProcess],
})
export class ChainsModule {}
