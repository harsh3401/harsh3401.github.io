import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
    <nav
      class="ps-5 navbar navbar-expand-lg navbar-light d-flex justify-content-between"
      style="background-color: #2224a2;"
    >
      <a class="navbar-brand  link-light" href="#">Stock Search</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse flex-grow-0 "
        id="navbarNavAltMarkup"
      >
        <div class="navbar-nav  ">
          <a class="nav-link border  rounded-5 link-light" href="#">Search</a>
          <a class="nav-link  link-light" href="#">Watchlist</a>
          <a class="nav-link  link-light">Portfolio</a>
        </div>
      </div>
    </nav>
  `,
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
