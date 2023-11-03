import {Component, OnInit} from '@angular/core';
import {MenuItem, MessageService} from "primeng/api";
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import Appointment, { Status } from './create-appointment/appointment';
import { addTwoHoursToTime, areDatesInSameWeek, getDayNameFromDate, getWeekRange, isBetweenHours, isToday } from './create-appointment/utils';
import  {Trainer} from './create-appointment/Trainer';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-kineto-tracker',
  templateUrl: './kineto-tracker.component.html',
  styleUrls: ['./kineto-tracker.component.css']
})
export class KinetoTrackerComponent implements OnInit{

  selectedTrainer: Trainer | undefined;
  selectedTitle!: string;
  dates: any;
  selectedHour!: string;
  selectedMinute!: string;
  containerWidth!: number;
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  items: MenuItem[]  = [
    {
      icon: 'pi pi-plus',
      command: () => {
        this.addAppointmentsModalVisible = true;
      },
    }
  ];
  selectedDate: Date = new Date();
  addAppointmentsModalVisible: boolean = false;
  appointments: Appointment[] = [];
  finishedStatus = Status.finished;
  ongoingStatus = Status.ongoing;
  upcomingStatus = Status.upcoming;
  addTwoHoursToTime = addTwoHoursToTime;
  isToday = isToday
  skeletonItems: any[] = Array(2).fill(0);
  noAppointments: boolean = false;
  appointmentsSelectedWeek: Appointment[] = [];
  lastDayOfSelectedWeek!: Date;
  firstDayOfSelectedWeek!: Date;
  areDatesInTheSameWeek = areDatesInSameWeek
  getDayNameFromDate = getDayNameFromDate;
  editAppointmentDialog: boolean = false;
  selectedAppointment: Appointment | undefined;
    trainers : Trainer[] = [
    { name: 'Dan'},
    { name: 'Daniel'},
    { name: 'Raluca'},
    { name: 'Catalina'}];

  constructor(private messageService: MessageService, private appointmentService : AppointmentService) {
    this.containerWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));
  }
  ngOnInit(): void {
    let days = getWeekRange(this.selectedDate);
    this.firstDayOfSelectedWeek = days.firstDay;
    this.lastDayOfSelectedWeek = days.lastDay;
    this.getSelectedDayAppointments();
    this.getSelectedWeekAppointments();
  }
  getSelectedWeekAppointments() {
    this.appointmentService.getAppointmentsByWeek(this.selectedDate).subscribe(
      (appointments) => {
        const today = new Date();
        this.appointmentsSelectedWeek = appointments.map((appointment) => {
          appointment.date = new Date(appointment.date);
          const appointmentDatePlusTwoHours = new Date(appointment.date);
          appointmentDatePlusTwoHours.setHours(appointmentDatePlusTwoHours.getHours() + 2);
          appointment.hour = appointment.date.getHours().toString().padStart(2, '0');
          appointment.minute = appointment.date.getMinutes().toString().padStart(2, '0');
          appointment.status = today.getTime() > appointmentDatePlusTwoHours.getTime() ? Status.finished : today.getTime() < appointment.date.getTime() ? Status.upcoming : Status.ongoing;
          return appointment;
        });
      },
      (error) => {
        console.log(error);
      });
  }


  getSelectedDayAppointments() {
    this.appointmentService.getAppointmentsByDate(this.selectedDate).subscribe(
      (appointments) => {
        this.noAppointments = appointments.length === 0;
        const today = new Date();
        this.appointments = appointments.map((appointment) => {
          appointment.date = new Date(appointment.date);
          const appointmentDatePlusTwoHours = new Date(appointment.date);
          appointmentDatePlusTwoHours.setHours(appointmentDatePlusTwoHours.getHours() + 2);
          appointment.hour = appointment.date.getHours().toString().padStart(2, '0');
          appointment.minute = appointment.date.getMinutes().toString().padStart(2, '0');
          appointment.status = today.getTime() > appointmentDatePlusTwoHours.getTime() ? Status.finished : today.getTime() < appointment.date.getTime() ? Status.upcoming : Status.ongoing;
          return appointment;
        });
      },
      (error) => {
        console.log(error);
      });
  }

  editAppointment() {
    const currentAppointmentDate = new Date(this.selectedAppointment!.date);
    this.selectedAppointment!.title = this.selectedTitle;
    this.selectedAppointment!.trainer = this.selectedTrainer!.name;
    this.selectedAppointment!.date.setHours(parseInt(this.selectedHour, 10), parseInt(this.selectedMinute, 10));
    this.selectedAppointment!.date.setSeconds(0);
    this.selectedAppointment!.hour = this.selectedHour;
    this.selectedAppointment!.minute = this.selectedMinute;
    this.appointmentService.editAppointment(this.selectedAppointment, currentAppointmentDate).subscribe(
      (response : any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Appointment edited successfully!',
        });
        this.getSelectedDayAppointments();
        this.getSelectedWeekAppointments();
      },
      (error : HttpErrorResponse) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Appointment could not be edited!',
        });
      }
    );
  }   

  onResize(event: Event): void {
    this.containerWidth = window.innerWidth;

  }

  onAppointmentsSuccesfull($event: boolean) {
    if($event) {
      this.getSelectedDayAppointments();
      this,this.getSelectedWeekAppointments();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Appointments created successfully!',
      });
    }
    else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Appointments could not be created!',
      });
    }
  }

  changeAppointmentsModalValue($event: boolean) {
    this.addAppointmentsModalVisible = $event;
  }

  onSelectDate($event: Date) {
    if(this.selectedDate != $event) {
      if(!areDatesInSameWeek(this.selectedDate, $event)) {
        this.selectedDate = $event;
        this.getSelectedWeekAppointments();
      }
      this.selectedDate = $event;
      this.getSelectedDayAppointments();
      this.getSelectedWeekAppointments();
      let days = getWeekRange(this.selectedDate);
      this.firstDayOfSelectedWeek = days.firstDay;
      this.lastDayOfSelectedWeek = days.lastDay;
      this.editAppointmentDialog = false;
    }
  }

  toggleEditAppointment(appointment: Appointment) {
    this.editAppointmentDialog = !this.editAppointmentDialog;
    if(!this.editAppointmentDialog) {
      this.selectedAppointment = undefined;
    }
    else {
      this.selectedAppointment = appointment;
      this.selectedTitle = appointment.title
      // this.selectedTrainer = new Trainer();
      // this.selectedTrainer.name = appointment.trainer;
      this.selectedDate = appointment.date;
      this.selectedHour = appointment.hour;
      this.selectedMinute = appointment.minute;    
    }
  }

  toggleDeleteAppointment(appointment: Appointment) {
    this.appointmentService.deleteAppointment(appointment).subscribe(
      (response : any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Appointment deleted successfully!',
        });
        this.getSelectedDayAppointments();
        this.getSelectedWeekAppointments();
      },
      (error : HttpErrorResponse) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Appointment could not be deleted!',
        });
      }
    );
  }
  setSelectedMinute($event: string) {
    this.selectedMinute = $event;
  }
  setSelectedHour($event: string) {
    this.selectedHour = $event;
  }
  changeTrainer(appointment: Appointment) {
    // appointment.trainer = this.selectedTrainer.name;
  }
  closeEditAppointmentModal() {
    this.editAppointmentDialog = false;
  
  }
  getAppointmentsByDay(day: string): Appointment[] {
    // create a list with the appointments from the appointmenstSelectedWeek list that have the same day name as the selected day name
    return this.appointmentsSelectedWeek.filter((appointment) => {
      return getDayNameFromDate(appointment.date) === day;
    });
  }

}

