import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing } from './chains.routing';
import { ChainsComponent } from './chains.component';
import { ChainsListComponent } from './components/list/list.component';
import { ChainsDetailComponent } from './components/detail/detail.component';
import { ChainsService } from './chains.service';

import { VisModule } from 'ng2-vis';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    VisModule,
  ],
  declarations: [
    ChainsComponent,
    ChainsListComponent,
    ChainsDetailComponent,
  ],
  providers: [
    ChainsService,
  ],
})
export class ChainsModule {}
