import { Component, Input, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  RouterLinkActive,
} from '@angular/router';
import { StockSearchService } from '../../services/search-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLinkActive],
  template: `
    <nav
      class="ps-5 navbar navbar-expand-lg navbar-dark d-flex justify-content-between "
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
          <span style="color:white" class="navbar-toggler-icon "></span>
        </button>

        <div
          class="collapse navbar-collapse flex-grow-0  gap-2 text-white"
          id="navbarNav"
        >
          <ul class="navbar-nav">
            <li
              class="nav-item  "
              [className]="
                this.curRouteName.includes('search')
                  ? ' nav-item  border border-white rounded-pill'
                  : 'nav-item '
              "
            >
              <a
                class="nav-link  header-link px-3  "
                [class.active-link]="this.curRouteName.includes('search')"
                (click)="redirectSearch()"
              >
                Search
              </a>
            </li>
            <li
              class="nav-item"
              [className]="
                this.curRouteName.includes('watchlist')
                  ? ' nav-item  border border-white rounded-pill'
                  : 'nav-item '
              "
            >
              <a
                [class.active-link]="this.curRouteName.includes('watchlist')"
                class="nav-link header-link px-3 font-col "
                (click)="redirect('watchlist')"
              >
                Watchlist
              </a>
            </li>
            <li
              class="nav-item"
              [className]="
                this.curRouteName.includes('portfolio')
                  ? ' nav-item  border border-white rounded-pill'
                  : 'nav-item '
              "
            >
              <a
                [class.active-link]="this.curRouteName.includes('portfolio')"
                class="nav-link header-link px-3 font-col "
                (click)="redirect('portfolio')"
              >
                Portfolio
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() route: ActivatedRoute = inject(ActivatedRoute);
  stockInformationService: StockSearchService = inject(StockSearchService);
  curRouteName: string = 'search';
  constructor(private router: Router) {}

  redirect(path: string) {
    this.router.navigate([path]);
  }

  redirectSearch() {
    if (this.stockInformationService.ticker) {
      this.router.navigate([`search/${this.stockInformationService.ticker}`]);
    } else {
      this.router.navigate([`search/home`]);
    }
  }
  ngOnInit() {
    console.log(this.curRouteName);
    console.log(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.curRouteName = event.url === '/' ? 'search' : event.url;
          console.log(event.url);
        }
      })
    );
    // this.route.paramMap.subscribe((paramMap) => {})
    // console.log(this.route.snapshot);
  }
}
