import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { ProcessesService } from '../../@core/data/processes.service';
import { FormatsService } from '../../@core/data/formats.service';
import { DataTypesService } from '../../@core/data/data.types.service';

import { TagInputModule } from 'ngx-chips';
import { ArchwizardModule } from 'angular-archwizard';


@NgModule({
  imports: [
    ThemeModule,
    TagInputModule,
    ArchwizardModule,
  ],
  declarations: [
    AddComponent,
    ListComponent,
  ],
  providers: [
    ProcessesService,
    FormatsService,
    DataTypesService,
  ],
})
export class ProcessesModule { }
