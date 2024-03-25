import { Component, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { StockConfig } from '../types';
import { ChartsTabComponent } from './charts-tab/charts-tab.component';
import { InsightsTabComponent } from './insights-tab/insights-tab.component';
import { SummaryTabComponent } from './summary-tab/summary-tab.component';
import { TopNewsTabComponent } from './top-news-tab/top-news-tab.component';
@Component({
  selector: 'app-tab-group',
  standalone: true,
  imports: [
    SummaryTabComponent,
    TopNewsTabComponent,
    ChartsTabComponent,
    InsightsTabComponent,
    MatTabsModule,
  ],
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.css',
})
export class TabGroupComponent {
  @Input()
  stockData!: StockConfig;
}
