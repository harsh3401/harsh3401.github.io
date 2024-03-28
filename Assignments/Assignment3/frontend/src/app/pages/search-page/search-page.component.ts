import { Component, Input, ViewChild } from '@angular/core';
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
  @ViewChild(AutocompleteFilter) autocompleteComponent!: AutocompleteFilter;

  constructor(private router: Router, private alertService: AlertService) {}
  clearSearch(): void {
    this.autocompleteComponent.inputControl.setValue('');
    this.router.navigate([`/search/home`]);
  }
  searchTicker(): void {
    if (this.autocompleteComponent.inputControl.value === '') {
      this.alertService.showAlert(
        'Please enter a valid Ticker',
        'danger',
        false,
        false
      );
    }
    this.router.navigate([
      `/search/${this.autocompleteComponent.inputControl.value}`,
    ]);
  }
}
