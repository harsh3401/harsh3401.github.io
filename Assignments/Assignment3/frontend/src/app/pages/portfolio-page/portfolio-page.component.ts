import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { BuySellModalComponent } from '../../buy-sell-modal/buy-sell-modal.component';
import { CustomAlertComponent } from '../../components/custom-alert/custom-alert.component';
import { PortfolioItem } from '../../components/types';
import { AlertService } from '../../services/alert.service';
import { StockSearchService } from '../../services/search-service.service';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [
    CommonModule,
    BuySellModalComponent,
    CustomAlertComponent,
    MatProgressSpinnerModule,
    NgbAlertModule,
  ],
  templateUrl: './portfolio-page.component.html',
  styleUrl: './portfolio-page.component.css',
})
export class PortfolioPageComponent implements OnInit {
  @ViewChild(CustomAlertComponent) alertComponent!: CustomAlertComponent;
  @ViewChild(BuySellModalComponent) modalComponent!: BuySellModalComponent;

  portfolio!: PortfolioItem[];
  balance!: number;
  loading: boolean = false;
  stockBuyService: UserService = inject(UserService);
  stockSearchService: StockSearchService = inject(StockSearchService);
  marketOpen: boolean = false;
  alertShow: boolean = false;
  formatNo(numberT: any) {
    return Number(numberT).toLocaleString('en-GB');
  }
  constructor(private alertService: AlertService) {}
  openStockModal(sell = false, portfolioItem: PortfolioItem) {
    console.log(portfolioItem);
    this.modalComponent.open(
      portfolioItem.price,
      this.balance,
      sell,
      portfolioItem.ticker,
      portfolioItem.quantity,
      this.refetch,
      portfolioItem.corporationName
    );
  }
  refetch = () => {
    this.loading = true;
    this.stockSearchService.getMarketStatus('AAPL').then((data) => {
      const marketStatus =
        new Date().getTime() - new Date(data.t * 1000).getTime() < 300000;
      this.marketOpen = marketStatus;
    });
    this.stockBuyService.getPortfolio().then((data) => {
      this.portfolio = data;
      console.log(this.portfolio);

      if (data.length === 0) {
        this.loading = false;
        this.alertShow = true;
      } else {
        this.alertShow = false;
      }

      this.loading = false;
    });
    this.stockBuyService.getWalletBalance().then((data) => {
      this.balance = data.balance;
    });
  };
  ngOnInit() {
    this.refetch();
  }
}
