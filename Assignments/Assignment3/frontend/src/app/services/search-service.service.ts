import { Injectable } from '@angular/core';
import { StockSearchItem } from '../../services/stock-search-item';
import { StockConfig, news_format } from '../components/types';
import { environment } from '../environment.dev';

@Injectable({
  providedIn: 'root',
})
export class StockSearchService {
  protected stockSearchList: StockSearchItem[] = [];
  ticker!: string;
  stockConfig!: StockConfig;
  chartsChartOptions!: any;
  news!: any[];
  companyName!: string;
  insightsChartOptions!: any;
  summaryChartOptions!: any;
  sentimentData!: {
    mspr: {
      total: number;
      positive: number;
      negative: number;
    };
    change: {
      total: number;
      positive: number;
      negative: number;
    };
    recommendationData: {
      strongBuy: number[];
      buy: number[];
      hold: number[];
      sell: number[];
      strongSell: number[];
    };
    companyEarningData: {
      actual: number[];
      estimate: number[];
      period: string[];
      surprise: number[];
    };
  };
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
      `${environment.apiUrl}/user/portfolio-data?ticker=${search_string}`,
      `${environment.apiUrl}/user/watchlist-data?ticker=${search_string}`,
      `${environment.apiUrl}/api/company-peers?ticker=${search_string}`,
      `${environment.apiUrl}/api/historical-data?ticker=${search_string}&range=day`,
      `${environment.apiUrl}/user/wallet-balance`,
      `${environment.apiUrl}/user/portfolio-data?ticker=${search_string}`,
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
  async getSMAData(search_string: string): Promise<any> {
    const data = await fetch(
      `${environment.apiUrl}/api/historical-data?ticker=${search_string}&range=month`
    );
    return (await data.json()) ?? [];
  }

  async getInsightsData(search_string: string): Promise<any[]> {
    const urls = [
      `${environment.apiUrl}/api/insider-sentiment?ticker=${search_string}`,
      `${environment.apiUrl}/api/recommendation-trends?ticker=${search_string}`,
      `${environment.apiUrl}/api/company-earnings?ticker=${search_string}`,
      `${environment.apiUrl}/api/company-details?ticker=${search_string}`,
    ];
    const Promises = urls.map((url) => fetch(url));
    const responses = await Promise.all(Promises);
    return await Promise.all(responses.map((response) => response.json()));
  }
}
