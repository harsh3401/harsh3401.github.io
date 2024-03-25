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
  showAlert(message: string, type: string, dismissible = false) {
    if (this.alertComponentRef) {
      this.alertComponentRef.showAlert(message, type, dismissible);
    }
  }
  constructor() {}
}
