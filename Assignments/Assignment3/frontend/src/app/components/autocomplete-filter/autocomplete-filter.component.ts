import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
import { StockSearchService } from '../../services/search-service.service';
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
    MatProgressSpinnerModule,
    CommonModule,
  ],
})
export class AutocompleteFilter implements OnInit {
  @Input() ticker!: string | undefined;
  inputControl = new FormControl('');
  loading: boolean = false;
  filteredList: Observable<StockSearchItem[]> = new Observable<[]>();
  constructor(
    private filterService: StockSearchService,
    private router: Router
  ) {}
  async ngOnInit() {
    //TODO: Cancel request
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
    this.router.navigate([`/search/${event.option.value}`]);

    // Perform any action you want here
  }
}
