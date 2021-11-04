import {
  Component,
  OnChanges,
  ViewChild,
  Input,
  ElementRef,
} from '@angular/core';

import * as d3 from 'd3';

import { IChartData } from '../../interfaces';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements OnChanges {
  @ViewChild('svgElementRef', { static: true })
  public svgElementRef: ElementRef;
  @ViewChild('gElementRef', { static: true })
  public gElementRef: ElementRef;

  @Input('data')
  private chartData: IChartData;

  private svgElement: SVGElement;
  private gElement: SVGElement;

  ngOnChanges(): void {
    this.findDOMElements();
    this.update(this.chartData);
  }

  findDOMElements() {
    this.svgElement = this.svgElementRef.nativeElement;
    this.gElement = this.gElementRef.nativeElement;
  }

  update(data: IChartData) {
    // find svg tag for getting width and height attributes, define margin, define width and height of chart
    const svgElement: any = d3.select(this.svgElement);
    const margin = 200;
    const width = svgElement.attr('width') - margin;
    const height = svgElement.attr('height') - margin;

    // find <g> tag and translate it
    const gElement = d3
      .select(this.gElement)
      .attr('transform', 'translate(' + 100 + ',' + 100 + ')');

    // it returns xScale function
    const calculateXScale = () => {
      // create x axis scale
      return d3
        .scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.year) as any[])
        .padding(0.4);
    };
    // it returns yScale function
    const calculateYScale = () => {
      // create y axis scale
      return d3
        .scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, (d) => d.population)]);
    };

    // add heading
    d3.selectAll('.heading-text').remove();
    svgElement
      .append('text')
      .attr('class', 'heading-text')
      .attr('transform', 'translate(100,0)')
      .attr('x', 50)
      .attr('y', 50)
      .attr('font-size', '24px')
      .text('Population bar chart (Angular)');

    // draw new y-axis (Population), remove previous y-axis
    d3.selectAll('.y-axis').remove();
    gElement
      .append('g')
      .attr('class', 'y-axis')
      .call(
        d3
          .axisLeft(calculateYScale())
          .tickFormat((d) => d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
          .ticks(10)
      )
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '-5.5em')
      .attr('text-anchor', 'end')
      .attr('fill', '#5F6368')
      .attr('style', 'font: bold 16px sans-serif')
      .text('Population');

    // draw new draw x-axis (Year) remove previous x-axis
    d3.selectAll('.x-axis').remove();
    gElement
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(calculateXScale()))
      .append('text')
      .attr('y', height - 250)
      .attr('x', width - 15)
      .attr('text-anchor', 'end')
      .attr('fill', '#5F6368')
      .attr('style', 'font: bold 16px sans-serif')
      .text('Year');

    // draw bars by using pattern 'enter-update-exit' (in case when data changes)
    gElement
      .selectAll('.bar')
      .data(data)
      .join(
        (enter) => {
          //enter block, there are we add new bar elements
          const xScale = calculateXScale();
          const yScale = calculateYScale();

          return enter
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', '#4285f4')
            .attr('x', ({ year }) => xScale(year))
            .attr('y', (d) => yScale(d.population))
            .attr('width', xScale.bandwidth())
            .attr('height', (d) => height - yScale(d.population));
        },
        (update) => {
          //update block, there are we update properties of all updated elements
          const xScale = calculateXScale();
          const yScale = calculateYScale();

          return update
            .attr('x', (d) => xScale(d.year))
            .attr('y', (d) => yScale(d.population))
            .attr('width', xScale.bandwidth())
            .attr('height', (d) => height - yScale(d.population));
        },
        (exit) => {
          //exit block - it removes all elements which were removed from array
          return exit.remove();
        }
      );
  }
}
