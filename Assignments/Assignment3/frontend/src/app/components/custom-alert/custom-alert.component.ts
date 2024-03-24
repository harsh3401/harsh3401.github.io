import { Component, Input } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports: [NgbAlertModule],
  templateUrl: './custom-alert.component.html',
  styleUrl: './custom-alert.component.css',
})
export class CustomAlertComponent {
  show!: boolean;
  @Input() dismissable!: boolean;
  @Input() message!: string;
  @Input() color!: string;

  constructor(private alertService: AlertService) {}
  dismissAlert() {
    this.show = false;
  }
  ngOnInit(): void {
    // Set the reference to this alert component in the service
    this.show = false;
    this.alertService.setAlertComponentRef(this);
  }

  showAlert(message: string, color: string) {
    console.log('data received');
    this.show = true;
    this.message = message;
    this.color = color;
    // Logic to display the message in the alert component
  }
}
