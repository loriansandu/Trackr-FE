import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {LayoutService} from "../../../../services/layout/layout.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnChanges{
  constructor(private layoutService : LayoutService) {
  }

  @Input() containerWidth! : number;
  @Input() selectedDay!: Date;
  @Output() onSelectedDayChange = new EventEmitter<Date>();

  ngOnChanges(changes: SimpleChanges): void {

  }

  selectDay($event: Date) {
    this.selectedDay = $event;
    this.onSelectedDayChange.emit(this.selectedDay);
  }
}
