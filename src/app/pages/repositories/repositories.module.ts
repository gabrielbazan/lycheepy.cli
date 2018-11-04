import { NgModule } from '@angular/core';
import { ListComponent } from './list/list.component';
import { RepositoriesService } from '../../@core/data/repositories.service';
import {ThemeModule} from '../../@theme/theme.module';


@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    ListComponent,
  ],
  providers: [
    RepositoriesService,
  ],
})
export class RepositoriesModule { }
