import { Component, Input } from '@angular/core';
import { AutocompleteFilter } from '../../components/autocomplete-filter/autocomplete-filter.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [AutocompleteFilter],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css',
})
export class SearchPageComponent {
  @Input() ticker!: string;
}
