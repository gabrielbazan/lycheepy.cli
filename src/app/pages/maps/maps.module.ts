import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing } from './maps.routing';
import { Maps } from './maps.component';
import { LeafletMaps } from './components/leafletMaps/leafletMaps.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
  ],
  declarations: [
    Maps,
    LeafletMaps,
  ],
  providers: []
})
export class MapsModule {}
