import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { news_format } from '../types';

@Component({
  selector: 'ngbd-modal-content',
  standalone: true,
  templateUrl: './modal.component.html',
})
export class NgbdModalContent {
  activeModal = inject(NgbActiveModal);

  @Input()
  name!: string;

  @Input()
  newsObject!: news_format;
  https: any;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  template: '',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  private modalService = inject(NgbModal);

  open(newsData: news_format) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = 'News Modal';
    modalRef.componentInstance.newsObject = newsData;
  }
}
