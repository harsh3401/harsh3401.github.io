import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { StockSearchService } from '../../../services/search-service.service';
import { StockSearchItem } from '../../../services/stock-search-item';

@Component({
  selector: 'app-autocomplete-filter',
  standalone: true,
  templateUrl: './autocomplete-filter.component.html',
  styleUrl: './autocomplete-filter.component.css',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class AutocompleteFilter implements OnInit {
  inputControl = new FormControl('');
  filteredList: Observable<StockSearchItem[]> = new Observable<
    [
      {
        description: 'Apple Stock';
        displaySymbol: 'AAPL';
        symbol: 'AAP';
        type: '';
      }
    ]
  >();
  constructor(
    private filterService: StockSearchService,
    private router: Router
  ) {}
  async ngOnInit() {
    //TODO: Cancel request
    this.filteredList = this.inputControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value) => this.filterService.getFilteredListByString(value!))
    );
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.router.navigate([`/search/${event.option.value}`]);
    console.log('Selected option:', event.option.value);
    // Perform any action you want here
  }
}
