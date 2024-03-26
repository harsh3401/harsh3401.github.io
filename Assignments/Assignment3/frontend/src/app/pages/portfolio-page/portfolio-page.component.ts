import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BuySellModalComponent } from '../../buy-sell-modal/buy-sell-modal.component';
import { CustomAlertComponent } from '../../components/custom-alert/custom-alert.component';
import { PortfolioItem } from '../../components/types';
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
  formatNo(numberT: any) {
    return Number(numberT).toLocaleString('en-GB');
  }
  openStockModal(sell = false, portfolioItem: PortfolioItem) {
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
      console.log(this.portfolio);
      this.portfolio = data;
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
