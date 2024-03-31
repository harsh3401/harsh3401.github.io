import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { news_format } from '../types';

@Component({
  selector: 'ngbd-modal-content',
  standalone: true,
  templateUrl: './modal.component.html',
})
export class NgbdModalContent implements OnInit {
  activeModal = inject(NgbActiveModal);

  @Input()
  name!: string;

  @Input()
  newsObject!: any;
  https: any;
  ngOnInit() {
    const date = new Date(this.newsObject['datetime']);
    const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
      date
    );
    this.newsObject['datetime'] = formattedDate;
  }
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
