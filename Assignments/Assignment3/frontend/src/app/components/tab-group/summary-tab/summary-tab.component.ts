import { Component, Input, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { StockSearchService } from '../../../services/search-service.service';
import { StockConfig } from '../../types';
@Component({
  selector: 'app-summary-tab',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './summary-tab.component.html',
  styleUrl: './summary-tab.component.css',
})
export class SummaryTabComponent {
  chartData!: any;
  stockInformationService: StockSearchService = inject(StockSearchService);
  @Input() route: ActivatedRoute = inject(ActivatedRoute);
  @Input()
  stockData!: StockConfig;
  highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  constructor() {
    this.stockInformationService
      .getSMAData(this.route.snapshot.params['ticker'])
      .then((data) => {
        const priceData = data.map((obj: any) => {
          return obj['o'];
        });
        this.chartOptions = {
          accessibility: { enabled: false },
          title: { text: `${this.stockData?.ticker} Hourly price Variation` },
          series: [
            {
              name: 'Price',
              showInLegend: false,
              data: priceData,
              type: 'line',
            },
          ],
        };
      });
  }
}
