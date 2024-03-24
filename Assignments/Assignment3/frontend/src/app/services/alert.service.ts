import { Injectable } from '@angular/core';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertComponentRef: CustomAlertComponent | null = null;
  setAlertComponentRef(ref: CustomAlertComponent) {
    this.alertComponentRef = ref;
  }
  showAlert(message: string, color: string) {
    console.log('executing show');
    if (this.alertComponentRef) {
      this.alertComponentRef.showAlert(message, color);
    }
  }
  constructor() {}
}
