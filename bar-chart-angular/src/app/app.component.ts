import { Component, OnDestroy } from '@angular/core';
import { ChartDatasource } from './services/chart.datasource';
import { IChartData } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  private subscriptionChartData = null;
  public chartData: IChartData = null;
  public isChartVisible: boolean = true;

  constructor(private chartDatasource: ChartDatasource) {
    this.subscriptionChartData = chartDatasource
      .getChartData()
      .subscribe((data) => (this.chartData = data));
  }

  addBar(): void {
    const newChartData = [
      ...this.chartData,
      {
        year: (
          parseInt(this.chartData[this.chartData.length - 1].year) + 1
        ).toString(),
        population:
          this.chartData[this.chartData.length - 1].population * 1.011,
      },
    ];
    this.chartData = newChartData;
  }

  removeBar(): void {
    const newChartData = [
      ...this.chartData.slice(0, this.chartData.length - 1),
    ];
    this.chartData = newChartData;
  }

  mountUnmountChart(): void {
    this.isChartVisible = !this.isChartVisible;
  }

  ngOnDestroy(): void {
    if (this.subscriptionChartData !== null) {
      this.subscriptionChartData.unsubscribe();
      this.subscriptionChartData = null;
    }
  }
}
