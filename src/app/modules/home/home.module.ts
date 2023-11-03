import { NgModule } from '@angular/core';
import {CommonModule, DatePipe, NgOptimizedImage} from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import {HomeRoutingModule} from "./home-routing.module";
import {SharedModule} from "../shared/shared.module";
import {HomeComponent} from "./home/home.component";
import { ProfileComponent } from './profile/profile.component';
import {CardModule} from "primeng/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {AvatarModule} from "primeng/avatar";
import {InputNumberModule} from "primeng/inputnumber";
import {DialogModule} from "primeng/dialog";
import {PasswordModule} from "primeng/password";
import {KeyFilterModule} from "primeng/keyfilter";
import {MessagesModule} from "primeng/messages";
import {ToastModule} from "primeng/toast";
import {FileUploadModule} from "primeng/fileupload";
import {SkeletonModule} from "primeng/skeleton";
import {ConfirmPopupModule} from "primeng/confirmpopup";



@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
  ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        SharedModule,
        CardModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        AvatarModule,
        InputNumberModule,
        DialogModule,
        ReactiveFormsModule,
        PasswordModule,
        NgOptimizedImage,
        KeyFilterModule,
        MessagesModule,
        ToastModule,
        FileUploadModule,
        SkeletonModule,
        ConfirmPopupModule,

    ],
  providers: [
    DatePipe
  ]
})
export class HomeModule { }
