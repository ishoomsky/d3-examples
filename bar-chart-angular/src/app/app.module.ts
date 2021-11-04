import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { ChartDatasource } from './services/chart.datasource';

@NgModule({
  declarations: [AppComponent, BarChartComponent],
  imports: [BrowserModule],
  providers: [ChartDatasource],
  bootstrap: [AppComponent],
})
export class AppModule {}
