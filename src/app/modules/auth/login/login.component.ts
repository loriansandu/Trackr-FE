import {
  AfterViewInit,
  Component,
  ElementRef, HostListener, OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms ease-in', style({ opacity: 1 })),
      ]),
      // transition(':leave', animate('100ms ease-out', style({ opacity: 0 }))),
    ])]
})
export class LoginComponent implements OnInit, OnDestroy{

  isLoggedIn?: boolean;
  browserName!: string;
  resetPasswordLoading: boolean = false;
  successfulReset: boolean = false;
  loginWithGoogleFailed: boolean = false;
  authSubscription!: Subscription;
  userAgent: any;
  mobileUA: boolean  = false;
  chromeDesktopUA: boolean = false;
  desktopUa : boolean = false;
  containerWidth: string;

  constructor(private authService: AuthService,
              private router: Router,
              private socialAuthService: SocialAuthService,
              private renderer: Renderer2) {

    this.containerWidth = window.innerWidth < 576 ? '270' : '350';
  }
  handleAuthStateChange(user: SocialUser | null): void {
    if (user) {
      this.onLoginWithGoogle(user.idToken);
    } else {
    }
  }
  ngOnInit() {
    this.browserName = this.detectBrowserName();
    this.authSubscription = this.socialAuthService.authState.subscribe(
        (user) => {
          // Handle user authentication state changes here
          this.handleAuthStateChange(user);
        }
    );
    this.userAgent = navigator.userAgent;

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(this.userAgent))
      this.mobileUA = true;

    else if(/Chrome/i.test(this.userAgent))
      this.chromeDesktopUA = true;

    else
      this.desktopUa = true;
  }

  ngOnDestroy(): void {
    // Unsubscribe from the authState observable when the component is destroyed
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }


  @ViewChild('customGoogleBtn') customGoogleBtn!: ElementRef;
  socialUser!: SocialUser;
  invalidCredentials: boolean = false;
  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    // email: new FormControl('', []),
    password: new FormControl(
      '',
      [
        Validators.required,
        // Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[-@$!%*#?&])[A-Za-z\\d-@$!%*#?&]{8,}$")
      ])
  });
  resetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    // email: new FormControl('', []),
  });
  fieldTextType!: boolean;

  isEmailInvalid: boolean = false;
  isPasswordInvalid: boolean = false;
  isResetPasswordEmailInvalid: boolean = false;
  signInPage: boolean = true;
  signUpPage: boolean = false;

  error: boolean = false;
  resetPasswordPage: boolean = false;

  verifyCodePage: boolean = false;
  doesntExistEmail: boolean = false;
  loading: boolean = false;

  onSubmit(){
    this.onEmailFocusOut()
    this.onPasswordFocusOut()
    if (this.isEmailInvalid || this.isPasswordInvalid)
      return;

    this.onLogin();
  }
  onResetPasswordSubmit() {
    this.onResetPasswordEmailFocusOut()
    if (this.isResetPasswordEmailInvalid)
      return;
    this.onResetPassword();
  }
  onLogin() {
    this.loading = true;
    this.authService.login(this.authForm.value.email, this.authForm.value.password).subscribe(
      () => {
        console.log('Login successful');
      },
      (error : HttpErrorResponse) => {
        this.loading = false;
        console.error('Login failed', error);
        if(error.error.message === 'Account not verified') {
          this.verifyCodePage = true;
        }
        else
          this.invalidCredentials = true;
      }
    );
  }

  onLoginWithGoogle(idToken: string) {
    this.authService.loginWithGoogle(idToken).subscribe(
      () => {
        console.log('Login successful');
      },
      (error : HttpErrorResponse) => {
        console.error('Login failed', error);
        this.loginWithGoogleFailed = true;
      }
    );
  }
  onResetPassword() {
    this.resetPasswordLoading = true;
    this.authService.resetPassword(this.resetPasswordForm.value.email).subscribe(
      () => {
        console.log('Password reset successful');
        this.resetPasswordLoading = this.resetPasswordPage = false;
        this.successfulReset = true;
      },
      (error: HttpErrorResponse) => {
        console.error('Eroare', error);
        this.resetPasswordLoading = false;
        this.error = error.error.message === null;
        this.doesntExistEmail = error.error.message == 'Wrong email';
      }
    );
  }

  resetPassword() {
    this.resetPasswordPage = true;
    this.invalidCredentials = false;
    this.loginWithGoogleFailed = false;
  }
  getEmailError() {
    return this.authForm.controls.email.hasError('required') ?
      "Email is required." :
      this.authForm.controls.email.hasError('email') ?
        "Invalid email." : '';

  }
  getResetPasswordEmailError() {
    return this.resetPasswordForm.controls.email.hasError('required') ?
      "Email is required." :
      this.resetPasswordForm.controls.email.hasError('email') ?
        "Invalid email." : '';

  }
  getPasswordError() {
    return this.authForm.controls.password.hasError('required') ?
      "Password is required." :
      (this.authForm.controls.password.hasError('pattern'))
        ? "Password must meet the pattern requirements." : '';
  }
  onEmailFocusOut() {
    this.isEmailInvalid = this.authForm.controls.email.hasError('required') ||
      this.authForm.controls.email.hasError('email');
  }
  onResetPasswordEmailFocusOut() {
    this.isResetPasswordEmailInvalid = this.resetPasswordForm.controls.email.hasError('required') ||
      this.resetPasswordForm.controls.email.hasError('email');
  }
  onPasswordFocusOut() {
    this.isPasswordInvalid = this.authForm.controls.password.hasError('required') ||
      (this.authForm.controls.password.hasError('pattern') && this.signUpPage);
  }
  showPassword() {
    this.fieldTextType = !this.fieldTextType;
  }
  goBack() {
    this.resetPasswordPage = false;
    this.isResetPasswordEmailInvalid = false;
    this.resetPasswordForm.controls.email.reset();
    this.doesntExistEmail = false;
    this.successfulReset = false;
    this.resetPasswordLoading = false;
  }
  triggerGoogleAction(customButton : boolean) {
    if (customButton) {
      this.customGoogleBtn.nativeElement.querySelector('div[role="button"]').click();
    }

  }

  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }


}
