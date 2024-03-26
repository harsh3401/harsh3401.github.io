import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../services/alert.service';
import { UserService } from '../services/user-service.service';

@Component({
  selector: 'app-buy-sell-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './buy-sell-modal.component.html',
  styleUrl: './buy-sell-modal.component.css',
})
export class BuySellModalTemplate {
  constructor(private alertService: AlertService) {}
  executeSell() {
    this.stockBuyService
      .executeSell(this.ticker, this.qty)
      .then((tradeResult) => {
        if (tradeResult.Transaction) {
          this.activeModal.dismiss('Cross click');
          //Todo:Refetch on click
          this.alertService.showAlert(
            `${this.ticker} sold successfully`,
            'danger',
            true
          );
          this.refetch(false, this.ticker);
        }
      });
  }
  executeBuy() {
    this.stockBuyService
      .executeBuy(this.ticker, this.qty, this.companyName)
      .then((tradeResult) => {
        if (tradeResult.Transaction) {
          this.activeModal.dismiss('Cross click');
          this.alertService.showAlert(
            `${this.ticker} bought successfully`,
            'success',
            true
          );
        }
      });
  }
  //update to reflect state latest
  setQty($event: Event) {
    this.canSell = this.qtyOwned >= this.qty && this.qty != 0;
    this.canBuy =
      this.price * this.qty <= this.walletBalance && this.qty * this.price != 0;
  }
  qty: number = 0;
  activeModal = inject(NgbActiveModal);
  stockBuyService: UserService = inject(UserService);
  @Input()
  ticker!: string;
  @Input()
  walletBalance!: number;
  @Input()
  price!: number;
  @Input()
  sell!: boolean;
  @Input()
  qtyOwned!: number;
  canSell!: boolean;
  canBuy!: boolean;
  @Input()
  companyName!: string;
  refetch: any;
}

@Component({
  selector: 'app-stock-modal',
  standalone: true,
  imports: [],
  template: '',
})
export class BuySellModalComponent {
  private modalService = inject(NgbModal);
  @Input() route: ActivatedRoute = inject(ActivatedRoute);

  open(
    price: number,
    walletBalance: number,
    sell = false,
    ticker: string,
    qtyOwned: number = 0,
    refetch: any = function () {},
    companyName: string = ''
  ) {
    const modalRef = this.modalService.open(BuySellModalTemplate);
    modalRef.componentInstance.walletBalance =
      typeof walletBalance === 'number'
        ? walletBalance.toFixed(2)
        : walletBalance;
    modalRef.componentInstance.price = price;
    modalRef.componentInstance.ticker = ticker;
    modalRef.componentInstance.sell = sell;
    modalRef.componentInstance.qtyOwned = qtyOwned;
    modalRef.componentInstance.refetch = refetch;
    modalRef.componentInstance.companyName = companyName;
  }
}
