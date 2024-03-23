import { Injectable } from '@angular/core';
import { environment } from '../environment.dev';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}
  async executeBuy(ticker: string, qty: number): Promise<any> {
    const data = await fetch(`${environment.apiUrl}/user/buy-stock`, {
      method: 'POST', // Specify the HTTP method
      headers: {
        'Content-Type': 'application/json', // Add Content-Type header
      },
      body: JSON.stringify({ ticker: ticker, quantity: qty }), // Collect form data as JSON string
    });
    return (await data.json()) ?? { Transaction: false };
  }

  async addToWatchList(ticker: string, corporationName: string): Promise<any> {
    const data = await fetch(`${environment.apiUrl}/user/watchlist-item`, {
      // Specify the HTTP method
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Add Content-Type header
      },
      body: JSON.stringify({ ticker, corporationName }), // Collect form data as JSON string
    });
    return (await data.json()) ?? { Transaction: false };
  }
  //TODO:Change functionality
  async removeFromWatchList(ticker: string): Promise<any> {
    const data = await fetch(`${environment.apiUrl}/user/watchlist-item`, {
      // Specify the HTTP method
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Add Content-Type header
      },
      body: JSON.stringify({ ticker: ticker }), // Collect form data as JSON string
    });
    return (await data.json()) ?? { Transaction: false };
  }
  async getWatchList(): Promise<any> {
    const data = await fetch(`${environment.apiUrl}/user/watchlist`);
    return (await data.json()) ?? [];
  }
  async getPortfolio(): Promise<any> {
    const data = await fetch(`${environment.apiUrl}/user/portfolio`);
    return (await data.json()) ?? [];
  }
  async getWalletBalance(): Promise<any> {
    const data = await fetch(`${environment.apiUrl}/user/wallet-balance`);
    return (await data.json()) ?? [];
  }
  async deletefromWatchList(id: string): Promise<any> {
    const data = await fetch(
      `${environment.apiUrl}/user/watchlist-item/${id}`,
      {
        // Specify the HTTP method
        method: 'DELETE',
      }
    );
    return (await data.json()) ?? [];
  }
}
