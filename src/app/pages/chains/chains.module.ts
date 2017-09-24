import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { routing } from './chains.routing';
import { ChainsComponent } from './chains.component';
import { ChainsListComponent } from './components/list/list.component';
import { ChainsDetailComponent } from './components/detail/detail.component';
import { ExecutionResultComponent } from './components/execution-result/execution-result.component';

import { ChainsService } from '../../services/chains.service';
import { ExecutionsService } from '../../services/executions.service';

import { VisModule } from 'ng2-vis';

import { WpsService } from '../../services/wps.service';
import { CswService } from '../../services/csw.service';

import { ExecutionModal } from './components/execution/execution.component';

import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { DynamicFormsBootstrapUIModule } from '@ng-dynamic-forms/ui-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { TagInputModule } from 'ngx-chips';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    VisModule,
    NgbModalModule,
    DynamicFormsCoreModule.forRoot(),
    DynamicFormsBootstrapUIModule,
    ReactiveFormsModule,
    TagInputModule,
  ],
  declarations: [
    ChainsComponent,
    ChainsListComponent,
    ChainsDetailComponent,
    ExecutionModal,
    ExecutionResultComponent,
  ],
  providers: [
    ChainsService,
    WpsService,
    CswService,
    ExecutionsService,
  ],
  entryComponents: [ExecutionModal],
})
export class ChainsModule {}
