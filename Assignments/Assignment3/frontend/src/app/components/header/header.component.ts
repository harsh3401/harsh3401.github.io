import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StockSearchService } from '../../services/search-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
    <!-- TODO:Responsive collapse fix -->

    <nav
      class="ps-5 navbar navbar-expand-lg navbar-light d-flex justify-content-between"
      style="background-color: #2224a2;"
    >
      <div class="container-fluid">
        <a class="navbar-brand  link-light" href="#">Stock Search</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse flex-grow-0 " id="navbarNav">
          <p
            class="nav-link border  rounded-5 link-light"
            (click)="redirectSearch('search/home')"
          >
            Search
          </p>
          <p class="nav-link  link-light" (click)="redirect('watchlist')">
            Watchlist
          </p>
          <p class="nav-link  link-light" (click)="redirect('portfolio')">
            Portfolio
          </p>
        </div>
      </div>
    </nav>
  `,
})
export class HeaderComponent {
  stockInformationService: StockSearchService = inject(StockSearchService);
  constructor(private router: Router) {}
  redirect(path: string) {
    this.router.navigate([path]);
  }
  redirectSearch(path: string) {
    if (this.stockInformationService.ticker) {
      this.router.navigate([`search/${this.stockInformationService.ticker}`]);
    } else {
      this.router.navigate([`search/home`]);
    }
  }
}
