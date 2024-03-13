import { Routes } from '@angular/router';
import { SearchPageComponent } from './search-page/search-page.component';

export const routes: Routes = [
  {
    path: 'search/home',
    component: SearchPageComponent,
    title: 'Home Page',
  },
  { path: '', redirectTo: '/search/home', pathMatch: 'full' },
  //   {
  //     path: 'search/:ticker',
  //     component: DetailsComponent,
  //     title: 'House Details',
  //   },
  //   {
  //     path: 'watchlist',
  //     component: WatchListPage,
  //     title: 'House Details',
  //   },
  //   {
  //     path: 'portfolio',
  //     component: PortfolioPage,
  //     title: 'House Details',
  //   },
  { path: '**', redirectTo: '/search/home' },
];
