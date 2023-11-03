import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { KinetoTrackerRoutingModule } from './kineto-tracker-routing.module';
import { KinetoTrackerComponent } from './kineto-tracker/kineto-tracker.component';
import {SharedModule} from "../shared/shared.module";
import {CalendarModule} from "primeng/calendar";
import {FormsModule} from "@angular/forms";
import {CalendarComponent} from "./kineto-tracker/calendar/calendar.component";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {SpeedDialModule} from "primeng/speeddial";
import {PanelModule} from "primeng/panel";
import {DialogModule} from "primeng/dialog";
import { HorizontalCalendarComponent } from './kineto-tracker/horizontal-calendar/horizontal-calendar.component';
import {StepsModule} from "primeng/steps";
import { CreateAppointmentComponent } from './kineto-tracker/create-appointment/create-appointment.component';
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {SelectButtonModule} from "primeng/selectbutton";
import { AccordionModule } from 'primeng/accordion';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { TimePickerComponent } from './kineto-tracker/time-picker/time-picker.component';
import { DividerModule } from 'primeng/divider';
import {MessagesModule} from "primeng/messages";
import {ToastModule} from "primeng/toast";
import { TableModule } from 'primeng/table';
import {SkeletonModule} from "primeng/skeleton";
import { RippleModule } from 'primeng/ripple';
import { TimelineModule } from 'primeng/timeline';


@NgModule({
  declarations: [
    KinetoTrackerComponent,
    CalendarComponent,
    HorizontalCalendarComponent,
    CreateAppointmentComponent,
    TimePickerComponent,
  ],
  imports: [
    CommonModule,
    KinetoTrackerRoutingModule,
    SharedModule,
    CalendarModule,
    FormsModule,
    CardModule,
    ButtonModule,
    SpeedDialModule,
    PanelModule,
    DialogModule,
    StepsModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    SelectButtonModule,
    AccordionModule,
    VirtualScrollerModule,
    TagModule,
    AvatarModule,
    DividerModule,
    MessagesModule,
    ToastModule,
    TableModule,
    SkeletonModule,
    RippleModule,
    TimelineModule
  ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class KinetoTrackerModule { }
