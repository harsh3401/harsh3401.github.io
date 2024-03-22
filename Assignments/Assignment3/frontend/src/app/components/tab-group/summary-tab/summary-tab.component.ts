import { Component, Input } from '@angular/core';

import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { StockConfig } from '../../types';
@Component({
  selector: 'app-summary-tab',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './summary-tab.component.html',
  styleUrl: './summary-tab.component.css',
})
export class SummaryTabComponent {
  @Input()
  stockData!: StockConfig;
  highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  constructor() {
    this.chartOptions = {
      accessibility: { enabled: false },
      title: { text: `${this.stockData?.ticker} Hourly price Variation` },
      series: [
        {
          data: [1, 2, 3],
          type: 'line',
        },
      ],
    };
  }
}
