import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-buy-sell-modal',
  standalone: true,
  imports: [],
  templateUrl: './buy-sell-modal.component.html',
  styleUrl: './buy-sell-modal.component.css',
})
export class BuySellModalTemplate {
  activeModal = inject(NgbActiveModal);
  @Input()
  ticker!: string;
  @Input()
  walletBalance!: number;
  @Input()
  price!: number;
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
  open(price: number, walletBalance: number) {
    const modalRef = this.modalService.open(BuySellModalTemplate);
    modalRef.componentInstance.walletBalance = walletBalance;
    modalRef.componentInstance.price = price;
    modalRef.componentInstance.ticker = this.route.snapshot.params['ticker'];
  }
}
