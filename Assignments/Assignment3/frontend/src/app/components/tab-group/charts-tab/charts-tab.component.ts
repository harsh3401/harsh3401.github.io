import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import SMA from 'highcharts/indicators/ema';
import IndicatorsCore from 'highcharts/indicators/indicators';
import VBP from 'highcharts/indicators/volume-by-price';
import StockModule from 'highcharts/modules/stock';
import { StockSearchService } from '../../../services/search-service.service';

// Initialize required Highcharts modules
StockModule(Highcharts);
IndicatorsCore(Highcharts);
VBP(Highcharts);
SMA(Highcharts);

@Component({
  selector: 'app-charts-tab',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './charts-tab.component.html',
  styleUrl: './charts-tab.component.css',
})
export class ChartsTabComponent implements OnInit {
  stockInformationService: StockSearchService = inject(StockSearchService);
  highcharts: typeof Highcharts = Highcharts;
  ticker: string = 'test';
  @Input() route: ActivatedRoute = inject(ActivatedRoute);
  chartOptions!: any;
  ngOnInit() {
    const OHLC: any[][] = [];
    const volume: any[][] = [];
    this.route.paramMap.subscribe((paramMap) => {
      const ticker = paramMap.get('ticker');
      if (
        this.stockInformationService.ticker === ticker &&
        this.stockInformationService.chartsChartOptions
      ) {
        this.chartOptions = this.stockInformationService.chartsChartOptions;
      } else {
        this.stockInformationService
          .getSMAData(this.route.snapshot.params['ticker'])
          .then((response) => {
            response.map((chartObj: any) => {
              OHLC.push([
                chartObj['t'],
                chartObj['o'],
                chartObj['h'],
                chartObj['l'],
                chartObj['c'],
              ]);
              volume.push([chartObj['t'], chartObj['v']]);
            });

            const updatedOptions = {
              rangeSelector: {
                selected: 2,
              },

              title: {
                text: `${ticker} Historical`,
              },

              subtitle: {
                text: 'With SMA and Volume by Price technical indicators',
              },

              yAxis: [
                {
                  startOnTick: false,
                  endOnTick: false,
                  labels: {
                    align: 'right',
                    x: -3,
                  },
                  title: {
                    text: 'OHLC',
                  },
                  height: '60%',
                  lineWidth: 2,
                  resize: {
                    enabled: true,
                  },
                },
                {
                  labels: {
                    align: 'right',
                    x: -3,
                  },
                  title: {
                    text: 'Volume',
                  },
                  top: '65%',
                  height: '35%',
                  offset: 0,
                  lineWidth: 2,
                },
              ],

              tooltip: {
                split: true,
              },

              series: [
                {
                  type: 'candlestick',
                  name: 'AAPL',
                  id: 'aapl',
                  zIndex: 2,
                  data: OHLC,
                },
                {
                  type: 'column',
                  name: 'Volume',
                  id: 'volume',
                  data: volume,
                  yAxis: 1,
                },
                {
                  type: 'vbp',
                  linkedTo: 'aapl',
                  params: {
                    volumeSeriesID: 'volume',
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  zoneLines: {
                    enabled: false,
                  },
                },
                {
                  type: 'sma',
                  linkedTo: 'aapl',
                  zIndex: 1,
                  marker: {
                    enabled: false,
                  },
                },
              ],
            };
            this.chartOptions = updatedOptions;
            this.ticker = this.route.snapshot.params['ticker'];
            this.stockInformationService.chartsChartOptions = updatedOptions;
            this.stockInformationService.ticker = ticker!;
          });
      }
    });
  }
}
