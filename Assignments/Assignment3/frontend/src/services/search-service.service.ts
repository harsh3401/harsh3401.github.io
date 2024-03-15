import { Injectable } from '@angular/core';
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
    ];
    const Promises = urls.map((url) => fetch(url));
    const responses = await Promise.all(Promises);
    return await Promise.all(responses.map((response) => response.json()));
  }
}
