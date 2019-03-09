import { NgModule } from '@angular/core';
import { RepositoriesService } from '../../@core/data/repositories.service';
import { ThemeModule } from '../../@theme/theme.module';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';


@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    ListComponent,
    AddComponent,
  ],
  providers: [
    RepositoriesService,
  ],
})
export class RepositoriesModule { }
