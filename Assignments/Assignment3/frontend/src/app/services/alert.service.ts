import { Injectable } from '@angular/core';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component';
import { CustomAlertComponent2 } from './../components/custom-alert-2/custom-alert.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertComponentRef:
    | CustomAlertComponent
    | null
    | CustomAlertComponent2 = null;
  setAlertComponentRef(ref: CustomAlertComponent | CustomAlertComponent2) {
    this.alertComponentRef = ref;
  }
  hideAlert() {
    this.alertComponentRef?.dismissAlert();
  }
  showAlert(
    message: string,
    type: string,
    dismissible = false,
    hideable = true
  ) {
    if (this.alertComponentRef) {
      this.alertComponentRef.showAlert(message, type, dismissible, hideable);
    }
  }
  constructor() {}
}
