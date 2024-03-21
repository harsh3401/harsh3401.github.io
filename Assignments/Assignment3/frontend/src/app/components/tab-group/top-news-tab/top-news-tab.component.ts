import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockSearchService } from '../../../../services/search-service.service';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-top-news-tab',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './top-news-tab.component.html',
  styleUrl: './top-news-tab.component.css',
})
export class TopNewsTabComponent {
  @Input() route: ActivatedRoute = inject(ActivatedRoute);
  stockInformationService: StockSearchService = inject(StockSearchService);
  news!: any[];
  constructor() {
    const options: any = {
      year: 'numeric', // Full numeric representation of the year (e.g., 2024)
      month: 'long', // Full name of the month (e.g., February)
      day: 'numeric', // Day of the month (e.g., 8)
    };
    this.stockInformationService
      .getTopNews(this.route.snapshot.params['ticker'])
      .then((data) => {
        this.news = data.map((data: any) => {
          return {
            datetime: new Intl.DateTimeFormat('en-US', options).format(
              new Date(data['datetime'] * 1000)
            ),
            ...data,
          };
        });
      });
  }
}
