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
import { Subscription, interval, takeWhile } from 'rxjs';
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
  year: 'numeric', // Full numeric representation of the year (e.g., 2024)
  month: 'long', // Full name of the month (e.g., February)
  day: 'numeric', // Day of the month (e.g., 8)
};
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
            'success'
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
            'danger'
          );
        }
      });
  }
  refetch = (setLoad: boolean = true, ticker: string) => {
    this.loading = setLoad;

    this.stockInformationService.getCompanyData('MSFT').then((responses) => {
      if (responses[0].hasOwnProperty('ticker')) {
        const newStockConfig = {
          ticker: responses[0].ticker,
          logo: responses[0].logo,
          companyName: responses[0].name,
          marketName: responses[0].exchange,
          stockPrice: responses[1].c,
          priceTimestamp: new Date(responses[1].t * 1000),
          priceTimestampString: new Intl.DateTimeFormat(
            'en-US',
            options
          ).format(new Date(responses[1].t * 1000)),
          change: responses[1].d,
          changePercent: responses[1].dp,
          wishlist: responses[3].found,
          portfolio: responses[2].found,
          highPrice: responses[1].h,
          lowPrice: responses[1].l,
          openPrice: responses[1].o,
          prevClosePrice: responses[1].pc,
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
    this.route.paramMap.subscribe((paramMap) => {
      const ticker = paramMap.get('ticker');
      this.stockInformationService.getMarketStatus(ticker!).then((data) => {
        const marketStatus =
          new Date().getTime() - new Date(data.t * 1000).getTime() < 300000;
        this.marketOpen = marketStatus;
        if (marketStatus) {
          this.fetchMarketData = interval(15000) // Emit every 15 seconds
            .pipe(takeWhile(() => !this.marketOpen))
            .subscribe(() => {
              this.refetch(false, ticker!);
            });
        }
      });
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
                stockPrice: responses[1].c,
                priceTimestamp: new Date(responses[1].t * 1000),
                priceTimestampString: new Intl.DateTimeFormat(
                  'en-US',
                  options
                ).format(new Date(responses[1].t * 1000)),
                change: responses[1].d,
                changePercent: responses[1].dp,
                wishlist: responses[3].found,
                portfolio: responses[2].found,
                highPrice: responses[1].h,
                lowPrice: responses[1].l,
                openPrice: responses[1].o,
                prevClosePrice: responses[1].pc,
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
