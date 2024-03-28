import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { Subscription, from, interval, map, switchMap } from 'rxjs';
import { BuySellModalComponent } from '../../buy-sell-modal/buy-sell-modal.component';
import { SearchPageComponent } from '../../pages/search-page/search-page.component';
import { AlertService } from '../../services/alert.service';
import { FooterService } from '../../services/footer.service';
import { StockSearchService } from '../../services/search-service.service';
import { UserService } from '../../services/user-service.service';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { TabGroupComponent } from '../tab-group/tab-group.component';
import { StockConfig } from '../types';

const options: any = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h24',
};
const regex = /\//g;
@Component({
  selector: 'app-search-results-info',
  standalone: true,
  templateUrl: './search-results-info.component.html',
  styleUrl: './search-results-info.component.css',
  imports: [
    SearchPageComponent,
    CommonModule,
    TabGroupComponent,
    BuySellModalComponent,
    CustomAlertComponent,
    MatProgressSpinnerModule,
  ],
})
export class SearchResultsInfoComponent implements OnInit, OnDestroy {
  @ViewChild(BuySellModalComponent) modalComponent!: BuySellModalComponent;
  private fetchMarketData: Subscription | undefined;
  @Input() route: ActivatedRoute = inject(ActivatedRoute);
  stockInformationService: StockSearchService = inject(StockSearchService);
  stockUserService: UserService = inject(UserService);
  stockConfig!: StockConfig;
  footerService: FooterService = inject(FooterService);
  resultsFound: boolean = false;
  marketOpen: boolean = false;
  loading: boolean = false;
  constructor(private alertService: AlertService) {}
  openBuySellModal(sell = false) {
    this.modalComponent.open(
      this.stockConfig?.stockPrice,
      this.stockConfig?.walletBalance,
      sell,
      this.stockConfig?.ticker,
      this.stockConfig.qty,
      this.refetch,
      this.stockConfig.companyName
    );
  }
  addToWatchList() {
    this.stockUserService
      .addToWatchList(this.stockConfig.ticker, this.stockConfig.companyName)
      .then((response) => {
        if (response.Transaction) {
          this.stockConfig.wishlist = true;
          this.alertService.showAlert(
            `${this.stockConfig.ticker} added to the watchlist`,
            'success',
            true
          );
        }
      });
  }
  removeFromWatchList() {
    this.stockUserService
      .removeFromWatchList(this.stockConfig.ticker)
      .then((response) => {
        if (response.Transaction) {
          this.stockConfig.wishlist = false;
          this.alertService.showAlert(
            `${this.stockConfig.ticker} removed from the watchlist`,
            'danger',
            true
          );
        }
      });
  }
  refetch = (setLoad: boolean = true, ticker: string) => {
    this.loading = setLoad;

    this.stockInformationService.getCompanyData(ticker).then((responses) => {
      if (responses[0].hasOwnProperty('ticker')) {
        const newStockConfig = {
          ticker: responses[0].ticker,
          logo: responses[0].logo,
          companyName: responses[0].name,
          marketName: responses[0].exchange,
          stockPrice: responses[1].c.toFixed(2),
          priceTimestamp: new Date(responses[1].t * 1000),
          priceTimestampString: new Intl.DateTimeFormat('en-US', options)
            .format(new Date(responses[1].t * 1000))
            .replace(/\//g, '-')
            .replace(/,/g, ''),
          change: responses[1].d.toFixed(2),
          changePercent: responses[1].dp.toFixed(2),
          wishlist: responses[3].found,
          portfolio: responses[2].found,
          highPrice: responses[1].h.toFixed(2),
          lowPrice: responses[1].l.toFixed(2),
          openPrice: responses[1].o.toFixed(2),
          prevClosePrice: responses[1].pc.toFixed(2),
          ipoStartDate: responses[0].ipo,
          industry: responses[0].finnhubIndustry,
          webpage: responses[0].weburl,
          companyPeers: responses[4],
          chartData: responses[5],
          walletBalance: responses[6].balance.toFixed(2),
          qty: responses[7]?.qty ?? 0,
        };
        this.stockConfig = newStockConfig;
        this.stockInformationService.stockConfig = newStockConfig;
        this.resultsFound = true;
        this.stockInformationService.ticker = this.stockConfig.ticker!;
      } else {
        this.resultsFound = false;
        this.alertService.showAlert(
          'No data found. Please enter a valid Ticker',
          'danger'
        );
      }
      this.loading = false;
    });
  };

  ngOnInit() {
    this.loading = true;
    this.footerService.setPosition(true);
    this.route.paramMap
      .pipe(
        switchMap((paramMap) => {
          const ticker = paramMap.get('ticker');
          return from(
            this.stockInformationService.getMarketStatus(ticker!)
          ).pipe(
            // Pass the ticker to the subscribe method
            map((data) => ({ ticker, data }))
          );
        })
      )
      .subscribe(({ data, ticker }) => {
        const marketStatus =
          new Date().getTime() - new Date(data.t * 1000).getTime() < 300000;
        this.marketOpen = marketStatus;
        console.log(marketStatus);
        if (marketStatus) {
          this.fetchMarketData?.unsubscribe();
          this.fetchMarketData = interval(30000) // Emit every 30 seconds
            .subscribe(() => {
              console.log('here');
              this.refetch(false, ticker!);
            });
        }
        this.loading = true;
        this.footerService.setPosition(true);
        if (this.stockInformationService.ticker === ticker) {
          this.stockConfig = this.stockInformationService.stockConfig;
          this.resultsFound = true;
          this.loading = false;
        } else {
          this.stockInformationService
            .getCompanyData(ticker!)
            .then((responses) => {
              if (responses[0].hasOwnProperty('ticker')) {
                const newStockConfig = {
                  ticker: responses[0].ticker,
                  logo: responses[0].logo,
                  companyName: responses[0].name,
                  marketName: responses[0].exchange,
                  stockPrice: responses[1].c.toFixed(2),
                  priceTimestamp: new Date(responses[1].t * 1000),
                  priceTimestampString: new Intl.DateTimeFormat(
                    'en-US',
                    options
                  )
                    .format(new Date(responses[1].t * 1000))
                    .replace(/\//g, '-')
                    .replace(/,/g, ''),
                  change: responses[1].d.toFixed(2),
                  changePercent: responses[1].dp.toFixed(2),
                  wishlist: responses[3].found,
                  portfolio: responses[2].found,
                  highPrice: responses[1].h.toFixed(2),
                  lowPrice: responses[1].l.toFixed(2),
                  openPrice: responses[1].o.toFixed(2),
                  prevClosePrice: responses[1].pc.toFixed(2),
                  ipoStartDate: responses[0].ipo,
                  industry: responses[0].finnhubIndustry,
                  webpage: responses[0].weburl,
                  companyPeers: responses[4],
                  chartData: responses[5],
                  walletBalance: responses[6].balance.toFixed(2),
                  qty: responses[7]?.qty ?? 0,
                };
                this.stockConfig = newStockConfig;
                this.stockInformationService.stockConfig = newStockConfig;
                this.resultsFound = true;
                this.stockInformationService.ticker = ticker!;
              } else {
                this.resultsFound = false;
                this.alertService.showAlert(
                  'No data found. Please enter a valid Ticker',
                  'danger'
                );
              }
              this.loading = false;
            });
        }
      });
  }
  ngOnDestroy() {
    this.fetchMarketData?.unsubscribe(); // Unsubscribe to prevent memory leaks
  }
}
