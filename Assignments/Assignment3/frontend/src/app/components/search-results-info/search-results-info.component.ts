import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockSearchService } from '../../../services/search-service.service';
import { SearchPageComponent } from '../../pages/search-page/search-page.component';

interface StockConfig {
  ticker: string;
  logo: string;
  companyName: string;
  marketName: string;
  stockPrice: number;
  priceTimestamp: Date;
  change: number;
  changePercent: number;
  wishlist: boolean;
  portfolio: boolean;
  marketOpen: boolean;
  priceTimestampString: string;
}
const options: any = {
  year: 'numeric', // Full numeric representation of the year (e.g., 2024)
  month: 'long', // Full name of the month (e.g., February)
  day: 'numeric', // Day of the month (e.g., 8)
};

@Component({
  selector: 'app-search-results-info',
  standalone: true,
  imports: [SearchPageComponent],
  templateUrl: './search-results-info.component.html',
  styleUrl: './search-results-info.component.css',
})
export class SearchResultsInfoComponent {
  @Input() route: ActivatedRoute = inject(ActivatedRoute);
  stockInformationService: StockSearchService = inject(StockSearchService);
  stockConfig: StockConfig | null = null;
  new: any;
  constructor() {
    this.stockInformationService
      .getCompanyData(this.route.snapshot.params['ticker'])
      .then((responses) => {
        //TODO:Mapping to cleaner object
        this.stockConfig = {
          ticker: responses[0].ticker,
          logo: responses[0].logo,
          companyName: responses[0].name,
          marketName: responses[0].exchange,
          stockPrice: responses[1].c,
          priceTimestamp: new Date(responses[1].t * 1000),
          priceTimestampString: new Intl.DateTimeFormat(
            'en-US',
            options
          ).format(new Date(new Date(responses[1].t * 1000))),
          change: responses[1].d,
          marketOpen:
            new Date().getTime() - new Date(responses[1].t * 1000).getTime() <
            300000,
          changePercent: responses[1].dp,
          wishlist: responses[2].found,
          portfolio: responses[3].found,
        };
        console.log(this.stockConfig);
      });
  }
}
