import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {VerifyAccountComponent} from "./verify-account/verify-account.component";
import {DialogModule} from "primeng/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PasswordModule} from "primeng/password";
import {CheckboxModule} from "primeng/checkbox";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {ToggleButtonModule} from "primeng/togglebutton";
import {MessagesModule} from "primeng/messages";
import {NgOtpInputModule} from "ng-otp-input";
import {UtilitiesModule} from "../utilities/utilities.module";
import {GoogleSigninButtonModule} from "@abacritt/angularx-social-login";


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyAccountComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    ToggleButtonModule,
    MessagesModule,
    NgOtpInputModule,
    NgOptimizedImage,
    // AppModule,
    UtilitiesModule,
    GoogleSigninButtonModule,
  ]
})
export class AuthModule { }
