import { Routes } from '@angular/router';
import { SearchResultsInfoComponent } from './components/search-results-info/search-results-info.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';

export const routes: Routes = [
  {
    path: 'search/home',
    component: SearchPageComponent,
    title: 'Home Page',
  },
  { path: '', redirectTo: '/search/home', pathMatch: 'full' },
  {
    path: 'search/:ticker',
    component: SearchResultsInfoComponent,
    title: 'Stock Details',
  },
  { path: '**', redirectTo: '/search/home' },
];
