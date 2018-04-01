import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { routing } from './processes.routing';
import { ProcessesComponent } from './processes.component';
import { ProcessesListComponent } from './components/list';
import { ProcessesCreationComponent } from './components/creation';
// import { ProcessesEditionComponent } from './components/edition';

import { ProcessesService } from '../../services/processes.service';
import { FormatsService } from '../../services/formats.service'
import { DataTypesService } from '../../services/data.types.service'
import { WpsService } from '../../services/wps.service';

import { TagInputModule } from 'ngx-chips';

import { FormWizardModule } from 'angular2-wizard';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    NgbModalModule,
    TagInputModule,
    FormWizardModule
  ],
  declarations: [
    ProcessesComponent,
    ProcessesListComponent,
//    ProcessesEditionComponent,
    ProcessesCreationComponent,
  ],
  providers: [
    ProcessesService,
    WpsService,
    FormatsService,
    DataTypesService
  ],
  entryComponents: [],
})
export class ProcessesModule {}
