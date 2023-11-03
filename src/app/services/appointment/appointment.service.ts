import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Appointment from 'src/app/modules/kineto-tracker/kineto-tracker/create-appointment/appointment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(private http: HttpClient, private router: Router) {
  }
  getAppointmentsByDate(selectedDate: Date) {
    let requestPath: string = environment.apiUrl + `/api/appointments/date`;
    return this.http.get<Appointment[]>(requestPath, { params: { date: selectedDate.toDateString() } });
  }
  getAppointmentsByWeek(selectedDate: Date) {
    let requestPath: string = environment.apiUrl + `/api/appointments/week`;
    return this.http.get<Appointment[]>(requestPath, { params: { date: selectedDate.toDateString() } });
  }
  getLastAppointmentNumber(): Observable<number> {
    let requestPath: string = environment.apiUrl + `/api/appointments/last-appointment-number`;
    return this.http.get<number>(requestPath);
  }
  checkDatesAreAvailable(appointments: Appointment[]): Observable<any> { 
    let requestPath: string = environment.apiUrl + `/api/appointments/check-dates-are-available`;
    return this.http.post<any>(requestPath, appointments);
    }
  createAppointment(appointment: Appointment): Observable<any> {
    let requestPath: string = environment.apiUrl + `/api/appointments/create-appointment`;
    return this.http.post<any>(requestPath, appointment);
  }
  editAppointment(selectedAppointment: Appointment | undefined, date: Date) : Observable<any>{
    let requestPath: string = environment.apiUrl + `/api/appointments/edit-appointment`;
    return this.http.put<any>(requestPath, {selectedAppointment, date});
  }
  deleteAppointment(appointment: Appointment): Observable<any> {
    let requestPath: string = environment.apiUrl + `/api/appointments/delete-appointment`;
    return this.http.delete<any>(requestPath, {body: appointment});
  }
}
