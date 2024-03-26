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
  priceTimestampString: string;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  prevClosePrice: number;
  ipoStartDate: string;
  industry: string;
  webpage: string;
  companyPeers: string;
  chartData: any;
  walletBalance: number;
  qty: number;
}
export interface news_format {
  [key: string]: String;
}
export interface WatchListItem {
  ticker: string;
  corporationName: string;
  price: number;
  change: number;
  changePercentage: number;
  id: string;
}

export interface PortfolioItem {
  ticker: string;
  corporationName: string;
  price: number;
  change: number;
  changePercentage: number;
  id: string;
  quantity: number;
  averageCost: number;
  totalCost: number;
}
