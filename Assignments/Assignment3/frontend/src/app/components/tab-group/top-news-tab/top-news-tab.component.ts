import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FooterService } from '../../../services/footer.service';
import { StockSearchService } from '../../../services/search-service.service';
import { ModalComponent } from '../../modal/modal.component';
import { news_format } from '../../types';

@Component({
  selector: 'app-top-news-tab',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './top-news-tab.component.html',
  styleUrl: './top-news-tab.component.css',
})
export class TopNewsTabComponent implements OnInit {
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  @Input()
  active!: number;
  @Input() route: ActivatedRoute = inject(ActivatedRoute);
  footerService: FooterService = inject(FooterService);
  stockInformationService: StockSearchService = inject(StockSearchService);
  news!: any[];
  openModal(newsObject: news_format) {
    this.modalComponent.open(newsObject);
  }
  identify(_: any, newsItem: news_format) {
    return newsItem['headline'];
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['active'].currentValue === 1) {
      this.footerService.setPosition(false);
    }
  }

  ngOnInit() {
    const options: any = {
      year: 'numeric', // Full numeric representation of the year (e.g., 2024)
      month: 'long', // Full name of the month (e.g., February)
      day: 'numeric', // Day of the month (e.g., 8)
    };
    this.route.paramMap.subscribe((paramMap) => {
      const ticker = paramMap.get('ticker');
      if (
        this.stockInformationService.ticker === ticker &&
        this.stockInformationService.news
      ) {
        this.news = this.stockInformationService.news;
      } else {
        this.stockInformationService.getTopNews(ticker!).then((data) => {
          let updatedNews = data.slice(0, 20);

          updatedNews = updatedNews.map((data: any) => {
            return {
              datetime: new Intl.DateTimeFormat('en-US', options).format(
                new Date(data['datetime'] * 1000)
              ),
              ...data,
            };
          });
          this.news = updatedNews;
          this.stockInformationService.news = updatedNews;
          this.stockInformationService.ticker = ticker!;
        });
      }
    });
  }
}
