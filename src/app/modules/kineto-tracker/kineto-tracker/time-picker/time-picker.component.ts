import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownChangeEvent } from 'primeng/dropdown';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})

export class TimePickerComponent {
  @Output() emitHourValueToParent = new EventEmitter<string>();
  @Output() emitMinuteValueToParent = new EventEmitter<string>();
  hours: string[] = [];
  minutes: string[] = [];
  @Input() selectedHour: string = '08';
  @Input() selectedMinute: string = '00';

  constructor() {
    this.populateHours();
    this.populateMinutes();
  }

  emitHourValue($event: DropdownChangeEvent) {
    this.selectedHour = $event.value;
    this.emitHourValueToParent.emit(this.selectedHour);
  }

  emitMinuteValue($event: DropdownChangeEvent) {
    this.selectedMinute = $event.value;
    this.emitMinuteValueToParent.emit(this.selectedMinute);
  }
  populateHours() {
    for (let i = 8; i <= 20; i++) {
      this.hours.push(i.toString().padStart(2, '0'));
    }
  }

  populateMinutes() {
    for (let i = 0; i < 60; i += 30) {
      this.minutes.push(i.toString().padStart(2, '0'));
    }
  }
}
