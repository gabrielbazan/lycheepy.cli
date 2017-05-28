import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { Dashboard } from './dashboard.component';
import { routing } from './dashboard.routing';

import { TrafficChart } from './trafficChart';

import { TrafficChartService } from './trafficChart/trafficChart.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
  ],
  declarations: [
    TrafficChart,
    Dashboard,
  ],
  providers: [
    TrafficChartService,
  ],
})
export class DashboardModule {}
