import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  positionBottom: boolean = true;
  @Output() positionChange = new EventEmitter<boolean>();
  setPosition(newPosition: boolean) {
    this.positionBottom = newPosition;

    this.positionChange.emit(newPosition);
  }
  constructor() {}
}
