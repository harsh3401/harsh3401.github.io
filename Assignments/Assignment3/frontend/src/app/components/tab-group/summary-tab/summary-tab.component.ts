import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { FooterService } from '../../../services/footer.service';
import { StockSearchService } from '../../../services/search-service.service';
import { StockConfig } from '../../types';
const options: any = {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23', // Display hours in 24-hour format
};

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
  constructor(private router: Router) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['active'] && changes['active'].currentValue === 0) {
      this.footerService.setPosition(true);
    }
    if (changes['stockData']) {
      if (JSON.stringify(this.stockData.chartData) !== '{}') {
        const priceData = this.stockData.chartData.map((obj: any) => {
          return obj['o'];
        });
        const axisData = this.stockData.chartData.map((obj: any) => {
          return obj['t'];
        });

        this.chartOptions = {
          accessibility: { enabled: false },
          title: { text: `${this.stockData.ticker} Hourly price Variation` },
          series: [
            {
              name: 'Price',
              showInLegend: false,
              data: priceData.map((data: any, index: number) => {
                return [data, axisData[index]];
              }),
              type: 'line',
              marker: {
                // Add marker configuration to show data points
                enabled: false,
                symbol: 'circle', // Choose desired symbol for points
              },
            },
          ],
          xAxis: {
            // Set categories for x-axis ticks
            type: 'datetime',
          },
          yAxis: {
            opposite: true,
            title: {
              text: undefined,
            },
          },
          chart: {
            // Set grey background color
            backgroundColor: '#f2f2f2',
          },
        };
      }
    }
  }
  navigateToPeer(peer: any) {
    this.router.navigate([`search/${peer}`]);
  }
  ngOnInit() {
    if (JSON.stringify(this.stockData.chartData) !== '{}') {
      const priceData = this.stockData.chartData.map((obj: any) => {
        return obj['o'];
      });
      const axisData = this.stockData.chartData.map((obj: any) => {
        return obj['t'];
      });

      this.chartOptions = {
        accessibility: { enabled: false },
        title: { text: `${this.stockData.ticker} Hourly price Variation` },
        series: [
          {
            color: this.stockData.change > 0 ? 'green' : 'red',
            name: 'Price',
            showInLegend: false,
            data: priceData.map((data: any, index: number) => {
              return [axisData[index], data];
            }),
            type: 'line',
            marker: {
              // Add marker configuration to show data points
              enabled: false,
              symbol: 'circle', // Choose desired symbol for points
            },
          },
        ],
        xAxis: {
          // Set categories for x-axis ticks
          type: 'datetime',
        },
        yAxis: {
          opposite: true,
          title: {
            text: undefined,
          },
        },
        chart: {
          // Set grey background color
          backgroundColor: '#f2f2f2',
        },
      };
    }
  }
}
