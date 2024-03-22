import { Component, Input } from '@angular/core';
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
  ],
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.css',
})
export class TabGroupComponent {
  @Input()
  stockData!: StockConfig;
  switchTab(event: MouseEvent): void {
    const targetId = (event.target as HTMLElement)?.id;
    const targetTabId = targetId + '-content';
    for (let i = 0; i < 4; i++) {
      document.getElementById('tab-' + i + '-content')!.className =
        'tab-content ' + 'd-none';
      document.getElementById('tab-' + i)!.className = 'nav-link';
    }
    document.getElementById(targetTabId)!.className =
      'tab-content ' + 'd-block';
    document.getElementById(targetId)!.className = 'nav-link active';
  }
}
