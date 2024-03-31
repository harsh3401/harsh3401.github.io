import { Component, inject, OnInit } from '@angular/core';
import { FooterService } from '../../services/footer.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer style="background: rgb(216, 216, 216);" class="fw-bold  w-100 py-2">
      <div class="container">
        <div class="text-center">
          Powered by
          <a target="_blank" rel="noopener noreferrer" href="https://finnhub.io"
            >Finnhub.io</a
          >
        </div>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  position!: boolean;
  ngOnInit(): void {
    this.position = this.footerService.positionBottom;
    this.footerService.positionChange.subscribe((newPosition) => {
      this.position = newPosition;
    });
  }
  footerService: FooterService = inject(FooterService);
}
