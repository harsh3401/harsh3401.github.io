import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AutocompleteFilter } from '../../components/autocomplete-filter/autocomplete-filter.component';
import { CustomAlertComponent } from '../../components/custom-alert/custom-alert.component';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [AutocompleteFilter, CustomAlertComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css',
})
export class SearchPageComponent {
  @Input() ticker!: string | undefined;

  constructor(private router: Router, private alertService: AlertService) {}
  clearSearch(): void {
    this.router.navigate([`/search/home`]);
  }
  testModal() {
    this.alertService.showAlert('This is an alert message.', 'green');
  }
}
