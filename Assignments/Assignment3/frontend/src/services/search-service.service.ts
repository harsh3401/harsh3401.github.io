import { Injectable } from '@angular/core';
import { news_format } from '../app/components/types';
import { environment } from '../app/environment.dev';
import { StockSearchItem } from './stock-search-item';

@Injectable({
  providedIn: 'root',
})
export class StockSearchService {
  protected stockSearchList: StockSearchItem[] = [];
  constructor() {}

  async getFilteredListByString(
    search_string: string
  ): Promise<StockSearchItem[]> {
    const data = await fetch(
      `${environment.apiUrl}/api/search?search_string=${search_string}`
    );
    return (await data.json()) ?? [];
  }
  //TODO:any fix
  async getCompanyData(search_string: string): Promise<any[]> {
    const urls = [
      `${environment.apiUrl}/api/company-details?ticker=${search_string}`,
      `${environment.apiUrl}/api/quote?ticker=${search_string}`,
      `${environment.apiUrl}/user/portfolio?ticker=${search_string}`,
      `${environment.apiUrl}/user/watchlist?ticker=${search_string}`,
      `${environment.apiUrl}/api/company-peers?ticker=${search_string}`,
      `${environment.apiUrl}/api/historical-data?ticker=${search_string}&range=day`,
    ];
    const Promises = urls.map((url) => fetch(url));
    const responses = await Promise.all(Promises);
    return await Promise.all(responses.map((response) => response.json()));
  }
  async getTopNews(search_string: string): Promise<[news_format]> {
    const data = await fetch(
      `${environment.apiUrl}/api/company-news?ticker=${search_string}`
    );
    return (await data.json()) ?? [];
  }
}
