import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer
      style="background: rgb(216, 216, 216);border:2;"
      class="fw-bold position-absolute bottom-0 w-100"
    >
      <div style="width: fit-content;margin:auto">
        Powered by <a href=" https://finnhub.io">Finnhub.io</a>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.css',
})
export class FooterComponent {}
