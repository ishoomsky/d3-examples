import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { IChartData } from '../interfaces';

@Injectable()
export class ChartDatasource {
  chartData: IChartData = [
    { year: '1000', population: 400000 },
    { year: '1750', population: 800000 },
    { year: '1850', population: 1262000 },
    { year: '1900', population: 1656000 },
    { year: '1950', population: 2518629 },
    { year: '1955', population: 2755823 },
    { year: '1960', population: 3021475 },
    { year: '1965', population: 3334874 },
    { year: '1970', population: 3692492 },
    { year: '1975', population: 4068109 },
    { year: '1980', population: 4434682 },
    { year: '1985', population: 4830979 },
    { year: '1990', population: 5263593 },
    { year: '1995', population: 5674380 },
    { year: '2000', population: 6070581 },
    { year: '2005', population: 6343628 },
    { year: '2013', population: 7162119 },
  ];

  private chartDataSubject: BehaviorSubject<IChartData> = new BehaviorSubject(
    this.chartData
  );
  private chartData$: Observable<IChartData> =
    this.chartDataSubject.asObservable();

  constructor() {}

  getChartData(): Observable<IChartData> {
    return this.chartData$;
  }
}
