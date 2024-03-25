import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { BuySellModalComponent } from '../../buy-sell-modal/buy-sell-modal.component';
import { CustomAlertComponent } from '../../components/custom-alert/custom-alert.component';
import { PortfolioItem } from '../../components/types';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [CommonModule, BuySellModalComponent, CustomAlertComponent],
  templateUrl: './portfolio-page.component.html',
  styleUrl: './portfolio-page.component.css',
})
export class PortfolioPageComponent implements OnInit {
  @ViewChild(CustomAlertComponent) alertComponent!: CustomAlertComponent;
  @ViewChild(BuySellModalComponent) modalComponent!: BuySellModalComponent;
  portfolio!: PortfolioItem[];
  balance!: number;
  stockBuyService: UserService = inject(UserService);

  openStockModal(sell = false, portfolioItem: PortfolioItem) {
    this.modalComponent.open(
      portfolioItem.price,
      this.balance,
      sell,
      portfolioItem.ticker,
      portfolioItem.quantity,
      this.refetch
    );
  }
  refetch = () => {
    this.stockBuyService.getPortfolio().then((data) => {
      this.portfolio = data;
    });
    this.stockBuyService.getWalletBalance().then((data) => {
      this.balance = data.balance;
    });
  };
  ngOnInit() {
    this.refetch();
  }
}
