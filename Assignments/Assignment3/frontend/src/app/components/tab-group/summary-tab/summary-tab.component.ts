import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { FooterService } from '../../../services/footer.service';
import { StockSearchService } from '../../../services/search-service.service';
import { StockConfig } from '../../types';
@Component({
  selector: 'app-summary-tab',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule],
  templateUrl: './summary-tab.component.html',
  styleUrl: './summary-tab.component.css',
})
export class SummaryTabComponent implements OnInit {
  chartData!: any;
  @Input()
  index!: number;
  stockInformationService: StockSearchService = inject(StockSearchService);
  @Input() route: ActivatedRoute = inject(ActivatedRoute);
  @Input()
  active!: number;
  @Input()
  stockData!: StockConfig;
  highcharts: typeof Highcharts = Highcharts;
  chartOptions!: any;
  footerService: FooterService = inject(FooterService);
  fetchError: boolean = false;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['active'] && changes['active'].currentValue === 0) {
      this.footerService.setPosition(true);
    }
    if (changes['stockData']) {
      if (JSON.stringify(this.stockData.chartData) !== '{}') {
        console.log(this.stockData);
        const priceData = this.stockData.chartData.map((obj: any) => {
          return obj['o'];
        });
        this.chartOptions = {
          accessibility: { enabled: false },
          title: { text: `${this.stockData.ticker} Hourly price Variation` },
          series: [
            {
              name: 'Price',
              showInLegend: false,
              data: priceData,
              type: 'line',
            },
          ],
        };
      }
    }
  }
  ngOnInit() {
    if (JSON.stringify(this.stockData.chartData) !== '{}') {
      const priceData = this.stockData.chartData.map((obj: any) => {
        return obj['o'];
      });
      this.chartOptions = {
        accessibility: { enabled: false },
        title: { text: `${this.stockData.ticker} Hourly price Variation` },
        series: [
          {
            name: 'Price',
            showInLegend: false,
            data: priceData,
            type: 'line',
          },
        ],
      };
    }
  }
}
