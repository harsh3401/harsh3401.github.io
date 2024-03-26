import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { CustomAlertComponent } from '../../components/custom-alert/custom-alert.component';
import { WatchListItem } from '../../components/types';
import { AlertService } from '../../services/alert.service';
import { StockSearchService } from '../../services/search-service.service';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-watch-list-page',
  standalone: true,
  imports: [CommonModule, CustomAlertComponent, MatProgressSpinnerModule],
  templateUrl: './watch-list-page.component.html',
  styleUrl: './watch-list-page.component.css',
})
export class WatchListPageComponent implements OnInit {
  watchList!: WatchListItem[];
  @ViewChild(CustomAlertComponent) alertComponent!: CustomAlertComponent;
  stockBuyService: UserService = inject(UserService);
  stockInfoService: StockSearchService = inject(StockSearchService);
  loading: boolean = true;

  watchListItemDelete(ticker: string) {
    this.stockBuyService.removeFromWatchList(ticker).then((response) => {
      this.stockBuyService.getWatchList().then((data) => {
        if (data.length === 0) {
          this.alertService.setAlertComponentRef(this.alertComponent);
          this.alertService.showAlert(
            "Currently you don't have any stock in your watchlist.",
            'warning',
            false
          );
        }

        this.watchList = data;
      });
    });
  }

  openSearch(ticker: string) {
    this.router.navigate([`/search/${ticker}`]);
  }

  ngOnInit() {
    this.stockBuyService.getWatchList().then((data) => {
      if (data.length === 0) {
        this.alertService.setAlertComponentRef(this.alertComponent);
        this.alertService.showAlert(
          "Currently you don't have any stock in your watchlist.",
          'warning',
          false
        );
      }

      this.watchList = data;
      this.loading = false;
    });
  }
  constructor(private alertService: AlertService, private router: Router) {}
}
