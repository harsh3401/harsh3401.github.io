import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsInfoComponent } from './search-results-info.component';

describe('SearchResultsInfoComponent', () => {
  let component: SearchResultsInfoComponent;
  let fixture: ComponentFixture<SearchResultsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchResultsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
