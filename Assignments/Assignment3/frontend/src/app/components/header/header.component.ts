import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
    <!-- TODO:Responsive collapse fix -->

    <nav
      class="ps-5 navbar navbar-expand-lg navbar-light d-flex justify-content-between"
      style="background-color: #2224a2;"
    >
      <div class="container-fluid">
        <a class="navbar-brand  link-light" href="#">Stock Search</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse flex-grow-0 " id="navbarNav">
          <a class="nav-link border  rounded-5 link-light" href="#">Search</a>
          <a class="nav-link  link-light" href="/watchlist">Watchlist</a>
          <a class="nav-link  link-light" href="/portfolio">Portfolio</a>
        </div>
      </div>
    </nav>
  `,
})
export class HeaderComponent {}
