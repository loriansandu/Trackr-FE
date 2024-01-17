import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {MenuItem, ScrollerOptions} from "primeng/api";
import {animate, state, style, transition, trigger} from "@angular/animations";
import Appointment, { Severity } from './appointment';
import { dialogError } from './dialogError';
import { getTimeFromDate, isBetweenHours, isToday, isHourAfterNow, sortDates, addTwoHoursToTime, getDayNameFromDate, formatDateToYYYYMMDD } from './utils';
import { UserService } from 'src/app/services/user/user.service';
import 'add-to-calendar-button';
import Reminder from './reminder';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { Trainer } from './Trainer';


@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', animate('250ms ease-out', style({ opacity: 0 }))),
    ])]
})
export class CreateAppointmentComponent implements OnChanges{

  constructor(private appointmentService : AppointmentService) { }

  ngOnChanges() {
    this.resetValues()
    if(this.addAppointmentsModalVisible) {
      this.appointmentService.getLastAppointmentNumber().subscribe(
        (lastAppointmentNumber: number) => {
          this.lastAppointmentNumber = lastAppointmentNumber  % 20;
      }
      ,
        (error) => {
        }
      )
    }
  }
  @Input() addAppointmentsModalVisible! : boolean;
  @Output() changeAppointmentsModalValue : EventEmitter<boolean> = new EventEmitter();
  @Output() appointmentsCreated : EventEmitter<boolean> = new EventEmitter();
  createAppModal: MenuItem[] = [{label: 'General'},{label: 'Date'},{label: 'Confirmation'}];
  scrollerHeight: string = '100px';
  activeIndex: number = 0;
  title: string | undefined;
  trainers: Trainer[] = [
    { name: 'Dan'},
    { name: 'Daniel'},
    { name: 'Raluca'},
    { name: 'Catalina'},];
  selectedTrainer: Trainer | undefined;
  numberOfAppointments: number | undefined;
  dialogError: dialogError = {}
  dates: Date[] = [];
  minDate: Date = new Date();
  allAppointmentsSameHour: string = 'yes';
  appointmentsHour: string = '08';
  appointmentsMinute: string = '00';
  appointments: Appointment[] = [];
  scrollerOptions: ScrollerOptions = {
    showSpacer : false,
  }
  lastAppointmentNumber! : number;
  reminders: Reminder[] = [];
  remindersAsJson: string = "";
  getDayNameFromDate = getDayNameFromDate;
  formatDateToYYYYMMDD = formatDateToYYYYMMDD;
  nextDialogLoading: boolean = false;

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  nextDialog() {
    if(this.activeIndex == 0) {
      this.nextDialogLoading = true;
      if(this.selectedTrainer && this.numberOfAppointments) {
        this.activeIndex ++;
        this.dialogError = {};
        this.appointments = [];
        for(let i = 0; i < this.numberOfAppointments; i++) {
          this.appointments.push({
            title: this.title || 'Kineto', 
            trainer: this.selectedTrainer.name,
            date: new Date(),
            hour: '',
            minute: ''
          });
        }
      }
      else {
        this.dialogError.error = 'Please complete all fields';
      }
      this.nextDialogLoading = false;
    }
    else if (this.activeIndex == 1) {
      this.nextDialogLoading = true;
      if(this.dates.length === this.numberOfAppointments) {
        for (let i = 0; i < this.appointments.length; i++) {
          const appointment = this.appointments[i];
          appointment.date = this.dates[i];
          appointment.number = this.lastAppointmentNumber + i + 1;
          appointment.severity = getSeverityBasedOnAppointmentNumber(appointment.number);
          if(this.allAppointmentsSameHour == 'no') {
            this.appointments[i].hour = this.appointments[i].hour || '08';
            this.appointments[i].minute = this.appointments[i].minute || '00';
          }
          else {
            this.appointments[i].hour = this.appointmentsHour;
            this.appointments[i].minute = this.appointmentsMinute;
          }
          this.appointments[i].date.setHours(parseInt(this.appointments[i].hour, 10), parseInt(this.appointments[i].minute, 10));
          this.appointments[i].date.setSeconds(0);
          if (isToday(appointment.date) && !isHourAfterNow(`${this.appointments[i].hour}:${this.appointments[i].minute}`)) {
            this.dialogError.error = 'Please select an hour after the current time';
            this.nextDialogLoading = false;
            return;
          }
        }
        this.appointmentService.checkDatesAreAvailable(this.appointments).subscribe( 
          (response) => {
            this.nextDialogLoading = false;
            this.activeIndex++;
            this.dialogError = {};
            this.sortAppointmentsByDate(this.appointments);
            this.addAppointmentsToRemindersList();
            this.scrollerHeight = this.appointments.length == 1 ? '175px' : this.appointments.length == 2 ? '250px' : '250px';
          }
          ,
            (error) => {
              this.nextDialogLoading = false;
              const dateArray : string[] = error.error.message.slice(1, -1).split(', ').map((date : any)  => date.replace(/,/g, ''));
              this.appointments.forEach((appointment) => {
                if(dateArray.includes(`${appointment.date.toLocaleDateString()}`)) { 
                  appointment.error = 'This date is not available';
                }
                else {
                  appointment.error = undefined;
                }
              })
              this.dialogError.error = dateArray.length > 1 ?`${dateArray} are not available, please select other dates or change the hours` :`${dateArray} is not available, please select other date or change the hour` ;
              return;
            }
        )

      }
      else {
        if(this.numberOfAppointments == 1) {
          this.dialogError.error = 'Please select a date';
        }
        else {
          this.dialogError.error = 'Please select all dates';
        }
        return;
      }
    }
    else {
      this.nextDialogLoading = true;
      this.sendAppointments(this.appointments);
    }
  }

  sendAppointments(appointments: Appointment[], index: number = 0) {
    if (index < appointments.length) {
      this.appointmentService.createAppointment(appointments[index]).subscribe(
        (response) => {
          this.dialogError = {};
          this.sendAppointments(appointments, index + 1);
        },
        (error) => {
          this.appointmentsCreated.emit(false);
          this.dialogError.error = 'Something went wrong, please try again';
          return;
        }
      );
    } else {
      this.nextDialogLoading = false;
      this.addAppointmentsModalVisible = false;
      this.hideModal();
      this.appointmentsCreated.emit(true);
    }
  }
  resetValues() {
    this.selectedTrainer = undefined;
    this.title = undefined;
    this.numberOfAppointments = undefined ;
    this.dialogError = {}
    this.dates = [];
    this.allAppointmentsSameHour = 'yes';
    this.appointmentsHour = '08';
    this.appointmentsMinute = '00';
    this.appointments = [];
    this.lastAppointmentNumber = 0;
    this.reminders = [];
    this.remindersAsJson = "";
    this.activeIndex = 0;
  }
  hideModal() {
    this.changeAppointmentsModalValue.emit(this.addAppointmentsModalVisible);
    this.resetValues();
  }
  
  updateDates() {
    // this.dates = sortDates(this.dates);
    if(this.dates.length === this.numberOfAppointments) {
      this.dates = sortDates(this.dates);
      this.dialogError = {};
      this.appointments.forEach((appointment, index) => {
        appointment.date = this.dates[index];
      })
    }
    else {
      if(this.numberOfAppointments == 1) {
        this.dialogError.error = 'Please select a date';
      }
      else {
        this.dialogError.error = 'Please select all dates';
      }
    }
  }
  getSelectedMinute($event: string, index: number) {
    if(index > -1) {
      this.appointments[index].minute = $event;
    }
    else {
      this.appointmentsMinute = $event;

    }
  }
  getSelectedHour($event: string, index: number) {
    if(index > -1) {
      this.appointments[index].hour = $event;
    }
    else {
      this.appointmentsHour = $event;
    }
  }
  sortAppointmentsByDate(appointments: Appointment[]) {
    appointments.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    })
  }
  addAppointmentsToRemindersList() {
    this.reminders = [];
    this.appointments.forEach((appointment, index) => {
      this.reminders.push({
        name: appointment.title ? appointment.title : 'Kineto' ,
        description: 'Appointment number ' + appointment.number + ' with ' + appointment.trainer,
        startDate: this.formatDateToYYYYMMDD(appointment.date),
        startTime: appointment.hour + ':' + appointment.minute,
        endTime: addTwoHoursToTime(appointment.hour, appointment.minute)

      })
    })  
    this.remindersAsJson += JSON.stringify(this.reminders, null, 2);
  }

  removeError() {
    this.dialogError = {};
    this.appointments.forEach(appointment => {
      appointment.error = undefined;
    });
  }
}

function getSeverityBasedOnAppointmentNumber(number: number): Severity | undefined {
  return number < 6 ? Severity.success : number < 11 ? Severity.info : number < 16 ? Severity.warning : Severity.danger;
}

