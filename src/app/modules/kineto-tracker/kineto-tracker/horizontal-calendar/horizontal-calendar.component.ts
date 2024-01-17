import {Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-horizontal-calendar',
  templateUrl: './horizontal-calendar.component.html',
  styleUrls: ['./horizontal-calendar.component.scss']
})
export class HorizontalCalendarComponent {
  week: Date[] = [];
  @Input() selectedDay!: Date;
  @Output() onSelectedDayChange = new EventEmitter<Date>();

  constructor() {
    this.week = this.getWeekDates(new Date());
  }

  scrollLeft() {
    const firstDayTimestamp = this.week[0].getTime();
    const newWeekStartDate = new Date(firstDayTimestamp - 7 * 24 * 60 * 60 * 1000);
    this.week = this.getWeekDates(newWeekStartDate);
  }

  scrollRight() {
    const lastDayTimestamp = this.week[this.week.length - 1].getTime();
    const newWeekStartDate = new Date(lastDayTimestamp + 24 * 60 * 60 * 1000);
    this.week = this.getWeekDates(newWeekStartDate);
  }

  selectDay(day: Date) {
    // this.updateWeek(day);
    this.selectedDay = day;
    this.onSelectedDayChange.emit(this.selectedDay);
  }

  updateWeek(startDate: Date) {
    this.week = [];
    for (let i = -3; i <= 3; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      this.week.push(day);
    }
  }
  isToday(day: Date): boolean {
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  }

  isSelectedDay(day: Date) {
    return (
      day.getDate() === this.selectedDay.getDate() &&
      day.getMonth() === this.selectedDay.getMonth() &&
      day.getFullYear() === this.selectedDay.getFullYear()
    );
  }

  getWeekDates(date: Date): Date[] {
    const weekDates: Date[] = [];
    const currentDay = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const startDate = new Date(date);
  
    // Calculate the start date (Monday) by subtracting the current day's index
    startDate.setDate(date.getDate() - currentDay + 1);
  
    // Generate dates for the entire week
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + i);
      weekDates.push(newDate);
    }
    return weekDates;
  }
  arrowAnimation: string | null = null;
  addArrowAnimation(arrow: string) {
    this.arrowAnimation = arrow;
    setTimeout(() => {
      this.arrowAnimation = null;
    }, 1000); // Set a longer delay to allow the animation to complete
  }


}
