import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
//import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { ProcessesService } from '../../@core/data/processes.service';


@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    //AddComponent,
    ListComponent,
  ],
  providers: [
    ProcessesService,
  ],
})
export class ProcessesModule { }
