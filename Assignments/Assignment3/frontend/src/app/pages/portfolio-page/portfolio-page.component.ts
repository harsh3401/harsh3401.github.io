import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { BuySellModalComponent } from '../../buy-sell-modal/buy-sell-modal.component';
import { PortfolioItem } from '../../components/types';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [CommonModule, BuySellModalComponent],
  templateUrl: './portfolio-page.component.html',
  styleUrl: './portfolio-page.component.css',
})
export class PortfolioPageComponent {
  @ViewChild(BuySellModalComponent) modalComponent!: BuySellModalComponent;
  portfolio!: PortfolioItem[];
  balance!: number;
  stockBuyService: UserService = inject(UserService);
  // portfolioItemDelete(id: string) {
  //   this.stockBuyService.deletefromPortfolio(id).then((response) => {
  //     console.log(response);
  //   });
  // }
  openStockModal(sell = false, portfolioItem: PortfolioItem) {
    this.modalComponent.open(
      portfolioItem.price,
      this.balance,
      sell,
      portfolioItem.ticker,
      portfolioItem.quantity
    );
  }
  constructor() {
    this.stockBuyService.getPortfolio().then((data) => {
      this.portfolio = data;
    });
    this.stockBuyService.getWalletBalance().then((data) => {
      this.balance = data.balance;
    });
  }
}
