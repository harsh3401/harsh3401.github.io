export interface StockConfig {
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
  //TODO:Change chartData type
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  prevClosePrice: number;
  ipoStartDate: string;
  industry: string;
  webpage: string;
  companyPeers: string;
  chartData: any;
}
export interface news_format {
  [key: string]: String;
}
