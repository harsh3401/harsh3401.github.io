import { Routes } from '@angular/router';
import { SearchResultsInfoComponent } from './components/search-results-info/search-results-info.component';
import { PortfolioPageComponent } from './pages/portfolio-page/portfolio-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { WatchListPageComponent } from './pages/watch-list-page/watch-list-page.component';

export const routes: Routes = [
  {
    path: 'search/home',
    component: SearchPageComponent,
    title: 'Home Page',
  },
  { path: '', redirectTo: '/search/home', pathMatch: 'full' },
  { path: 'portfolio', pathMatch: 'full', component: PortfolioPageComponent },
  { path: 'watchlist', pathMatch: 'full', component: WatchListPageComponent },
  {
    path: 'search/:ticker',
    component: SearchResultsInfoComponent,
    title: 'Stock Details',
  },
  { path: '**', redirectTo: '/search/home' },
];
