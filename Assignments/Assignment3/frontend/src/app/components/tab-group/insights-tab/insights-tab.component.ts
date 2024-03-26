import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { FooterService } from '../../../services/footer.service';
import { StockSearchService } from '../../../services/search-service.service';
interface Recommendation {
  buy: number; // Assuming buy property is of type string
  // Define other properties if necessary
}

@Component({
  selector: 'app-insights-tab',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './insights-tab.component.html',
  styleUrl: './insights-tab.component.css',
})
export class InsightsTabComponent implements OnInit {
  footerService: FooterService = inject(FooterService);
  @Input() route: ActivatedRoute = inject(ActivatedRoute);
  stockInformationService: StockSearchService = inject(StockSearchService);
  highcharts: typeof Highcharts = Highcharts;
  chartOptions!: any;
  companyName!: string;
  sentimentData!: {
    mspr: {
      total: number;
      positive: number;
      negative: number;
    };
    change: {
      total: number;
      positive: number;
      negative: number;
    };
    recommendationData: {
      strongBuy: number[];
      buy: number[];
      hold: number[];
      sell: number[];
      strongSell: number[];
    };
    companyEarningData: {
      actual: number[];
      estimate: number[];
      period: string[];
      surprise: number[];
    };
  };
  @Input()
  active!: number;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['active'].currentValue === 3) {
      this.footerService.setPosition(true);
    }
  }
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const ticker = paramMap.get('ticker');

      if (
        this.stockInformationService.ticker === ticker &&
        this.stockInformationService.sentimentData &&
        this.stockInformationService.companyName &&
        this.stockInformationService.insightsChartOptions
      ) {
        this.sentimentData = this.stockInformationService.sentimentData;
        this.companyName = this.stockInformationService.companyName;
        this.chartOptions = this.stockInformationService.insightsChartOptions;
      } else {
        this.stockInformationService.getInsightsData(ticker!).then((data) => {
          const sentimentMapped = {
            mspr: {
              total: 0,
              positive: 0,
              negative: 0,
            },
            change: {
              total: 0,
              positive: 0,
              negative: 0,
            },
          };
          data[0].forEach((sentimentObject: any) => {
            if (sentimentObject.mspr >= 0) {
              sentimentMapped.mspr.positive += sentimentObject.mspr;
            } else {
              sentimentMapped.mspr.negative += sentimentObject.mspr;
            }
            if (sentimentObject.change >= 0) {
              sentimentMapped.change.positive += sentimentObject.change;
            } else {
              sentimentMapped.change.negative += sentimentObject.change;
            }
            sentimentMapped.mspr.total += sentimentObject.mspr;
            sentimentMapped.change.total += sentimentObject.change;
          });

          const strongBuy: number[] = [];
          const buy: number[] = [];
          const hold: number[] = [];
          const sell: number[] = [];
          const strongSell: number[] = [];
          const timeSlots: string[] = [];

          data[1].forEach((recommendationObject: any) => {
            strongBuy.push(recommendationObject.strongBuy);
            buy.push(recommendationObject.buy);
            sell.push(recommendationObject.sell);
            strongSell.push(recommendationObject.strongSell);
            hold.push(recommendationObject.hold);
            timeSlots.push(recommendationObject.period);
          });

          const actual: number[] = [];
          const estimate: number[] = [];
          const period: string[] = [];
          const surprise: number[] = [];

          data[2].forEach((earningObject: any) => {
            actual.push(earningObject.actual);
            estimate.push(earningObject.estimate);
            period.push(earningObject.period);
            surprise.push(earningObject.surprise);
          });

          const chartOptions = {
            recommendation: {
              accessibility: { enabled: false },
              chart: {
                type: 'column',
              },
              title: {
                text: 'Recommendation Trends',
                align: 'left',
              },
              xAxis: {
                categories: timeSlots,
              },
              yAxis: {
                min: 0,
                title: {
                  text: 'Analysis',
                },
                stackLabels: {
                  enabled: true,
                },
              },
              legend: {
                align: 'left',
                x: 70,
                verticalAlign: 'top',
                y: 70,
                floating: true,
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false,
              },
              tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat:
                  '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
              },
              plotOptions: {
                column: {
                  stacking: 'normal',
                  dataLabels: {
                    enabled: true,
                  },
                },
              },
              series: [
                {
                  type: 'column',
                  name: 'Strong Buy',
                  data: strongBuy,
                },
                {
                  type: 'column',
                  name: 'Buy',
                  data: buy,
                },
                {
                  type: 'column',
                  name: 'Hold',
                  data: hold,
                },
                {
                  type: 'column',
                  name: 'Sell',
                  data: sell,
                },
                {
                  type: 'column',
                  name: 'Strong Sell',
                  data: strongSell,
                },
              ],
            },
            earnings: {
              accessibility: { enabled: false },
              chart: {
                type: 'spline',
              },
              title: {
                text: 'Historical EPS Surprises',
                align: 'left',
              },

              xAxis: {
                labels: {
                  format: '',
                },

                categories: period.map((periodObj, index) => {
                  return `<div class="d-flex flex-column gap-2"><p>${periodObj}</p><p>${surprise[index]}</p></div>`;
                }),

                maxPadding: 0.05,
                showLastLabel: true,
              },
              yAxis: {
                title: {
                  text: 'Quantity EPS',
                },

                lineWidth: 2,
              },
              legend: {
                enabled: false,
              },
              tooltip: {
                headerFormat: '<b>{series.name}</b><br/>',
                pointFormat: '{point.x} km: {point.y}°C',
              },
              plotOptions: {
                spline: {},
              },
              series: [
                {
                  type: 'spline',
                  name: 'Actual',
                  data: actual,
                },
                {
                  type: 'spline',
                  name: 'Estimate',
                  data: estimate,
                },
              ],
            },
          };
          const sentimentData = {
            ...sentimentMapped,
            recommendationData: {
              strongBuy,
              strongSell,
              buy,
              sell,
              hold,
            },
            companyEarningData: {
              actual,
              estimate,
              period,
              surprise,
            },
          };

          this.sentimentData = sentimentData;
          this.chartOptions = chartOptions;
          this.stockInformationService.sentimentData = sentimentData;
          this.stockInformationService.insightsChartOptions = chartOptions;
          this.stockInformationService.companyName = data[3].name;
          this.stockInformationService.ticker = ticker!;
        });
      }
    });
  }
}
