import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs';
import { StockSearchItem } from '../../../services/stock-search-item';
import { CustomAlertComponent } from '../../components/custom-alert/custom-alert.component';
import { AlertService } from '../../services/alert.service';
import { StockSearchService } from '../../services/search-service.service';
@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    CustomAlertComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css',
})
export class SearchPageComponent {
  @Input() ticker!: string | undefined;
  inputControl = new FormControl('');
  loading: boolean = false;
  filteredList: Observable<StockSearchItem[]> = new Observable<[]>();
  constructor(
    private router: Router,
    private alertService: AlertService,
    private filterService: StockSearchService
  ) {}

  async ngOnInit() {
    this.inputControl.setValue(this.ticker!);
    this.filteredList = this.inputControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => (this.loading = true)),
      filter((value) => value !== ''),
      switchMap((value) => this.filterService.getFilteredListByString(value!)),
      tap(() => (this.loading = false))
    );
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    if (this.inputControl.value) {
      this.router.navigate([`/search/${event.option.value}`]);
    }

    // Perform any action you want here
  }
  clearSearch(): void {
    this.inputControl.setValue('');
    this.router.navigate([`/search/home`]);
  }
  searchTicker(): void {
    const tickerValue = this.inputControl.value;

    if (tickerValue === '' || !this.ticker) {
      this.alertService.showAlert(
        'Please enter a valid Ticker',
        'danger',
        false,
        false
      );
    }
    if (this.inputControl.value) {
      this.router.navigate([`/search/${this.inputControl.value}`]);
    }
  }
}
