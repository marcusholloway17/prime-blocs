import { Component, Input, OnInit } from '@angular/core';
import type { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'ngx-custom-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  @Input() type: ChartType = 'bar';
  @Input() data: ChartData = { datasets: [] };
  @Input() options: ChartOptions = {};
  @Input() redraw: boolean = false;
  @Input() updateMode: any = undefined;
  @Input() width: number = 300;
  @Input() height: number = 150;
  @Input() cssClass: string = 'card p-1';

  constructor() {}

  ngOnInit(): void {}
}
