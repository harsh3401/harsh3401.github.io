import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports: [NgbAlertModule, CommonModule],
  templateUrl: './custom-alert.component.html',
  styleUrl: './custom-alert.component.css',
})
export class CustomAlertComponent implements OnInit {
  show!: boolean;

  @Input() dismissible!: boolean;
  @Input() message!: string;
  @Input() type!: string;

  constructor(private alertService: AlertService) {}
  dismissAlert() {
    this.show = false;
  }
  ngOnInit() {
    // Set the reference to this alert component in the service
    this.show = false;
    this.alertService.setAlertComponentRef(this);
  }

  showAlert(message: string, type: string, dismissible = false) {
    this.show = true;
    this.message = message;
    this.type = type;
    this.dismissible = dismissible;
    setTimeout(() => (this.show = false), 5000);
    // Logic to display the message in the alert component
  }
}
