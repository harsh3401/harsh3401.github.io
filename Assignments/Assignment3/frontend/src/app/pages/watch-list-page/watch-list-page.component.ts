import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { WatchListItem } from '../../components/types';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-watch-list-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watch-list-page.component.html',
  styleUrl: './watch-list-page.component.css',
})
export class WatchListPageComponent {
  watchList!: WatchListItem[];
  stockBuyService: UserService = inject(UserService);
  watchListItemDelete(ticker: string) {
    this.stockBuyService.removeFromWatchList(ticker).then((response) => {});
  }
  constructor() {
    this.stockBuyService.getWatchList().then((data) => {
      this.watchList = data;
    });
  }
}
