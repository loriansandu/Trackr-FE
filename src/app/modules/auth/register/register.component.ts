import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
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
export class RegisterComponent implements OnInit{
  constructor(private authService: AuthService,
              private router: Router,
              private socialAuthService: SocialAuthService,
              ) {
    this.containerWidth = window.innerWidth < 576 ? '270' : '350';
  }

  @ViewChild('customGoogleBtn') customGoogleBtn!: ElementRef;
  submitted: boolean = false;
  fieldTextType!: boolean;
  loading: boolean = false;
  containerWidth: string;
  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    // email: new FormControl('', []),
    password: new FormControl(
      '',
      [
        Validators.required,
        // Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[-@$!%*#?&])[A-Za-z\\d-@$!%*#?&]{8,}$")
      ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });
  isEmailInvalid: boolean = false;
  isPasswordInvalid: boolean = false;
  isConfirmPasswordInvalid: boolean = false;
  verifyCodePage: boolean = false;
  correctCode: boolean | undefined;
  invalidCredentials: boolean = false;
  invalidEmail: boolean = false;
  error: boolean = false;
  resetPasswordPage: boolean = false;
  authSubscription!: Subscription;
  loginWithGoogleFailed: boolean = false;

  ngOnInit(): void {
    this.authSubscription = this.socialAuthService.authState.subscribe(
        (user) => {
          // Handle user authentication state changes here
          this.handleAuthStateChange(user);
        }
    );
  }
  onSubmit(){
    this.invalidEmail = false;
    this.onEmailFocusOut()
    this.onPasswordFocusOut()
    this.onConfirmPasswordFocusOut()

    if (this.submitted || this.isEmailInvalid || this.isPasswordInvalid || this.isConfirmPasswordInvalid)
      return;

    this.submitted = true;
    this.onSignUp();
    this.submitted = false;
  }

  onSignUp() {
    if(this.isConfirmPasswordInvalid)
      return;
    this.loading = true;
    this.authService.signUp(this.authForm.value.email, this.authForm.value.password).subscribe(
      () => {
        this.verifyCodePage = true;
      },
      (error : HttpErrorResponse) => {
        this.loading = false;
        this.error = error.error.message === null
        this.invalidEmail = error.error.message == 'Email already exists'
      }
    );
  }

  getEmailError() {
    return this.authForm.controls.email.hasError('required') ?
      "Email is required." :
      this.authForm.controls.email.hasError('email') ?
        "Invalid email." : '';

  }
  getPasswordError() {
    return this.authForm.controls.password.hasError('required') ?
      "Password is required." :
      (this.authForm.controls.password.hasError('pattern'))
        ? "Password must meet the pattern requirements." : '';
  }
  getConfirmPasswordError() {
    return this.authForm.controls.confirmPassword.hasError('required') ?
      "This field is required." :
      this.authForm.controls.confirmPassword.value !== this.authForm.controls.password.value ?
        "Passwords do not match." : '';
  }
  onEmailFocusOut() {
    this.isEmailInvalid = this.authForm.controls.email.hasError('required') ||
      this.authForm.controls.email.hasError('email');
  }
  onPasswordFocusOut() {
    this.isPasswordInvalid = this.authForm.controls.password.hasError('required') ||
      (this.authForm.controls.password.hasError('pattern'));
  }
  onConfirmPasswordFocusOut() {
    this.isConfirmPasswordInvalid = this.authForm.controls.confirmPassword.hasError('required') ||
      this.authForm.controls.confirmPassword.value !== this.authForm.controls.password.value;
  }

  triggerGoogleAction() {
    this.customGoogleBtn.nativeElement.querySelector('div[role="button"]').click();
  }

  redirectToLoginPage() {
    this.router.navigateByUrl('auth/login').finally()
  }
  handleAuthStateChange(user: SocialUser | null): void {
    if (user) {
      this.onLoginWithGoogle(user.idToken);
    } else {
    }
  }

  onLoginWithGoogle(idToken: string) {
    this.authService.loginWithGoogle(idToken).subscribe(
        () => {
 
        },
        (error : HttpErrorResponse) => {
          this.loginWithGoogleFailed = true;
        }
    );
  }
  redirectToGithub() {
    window.open('https://github.com/loriansandu/Trackr.', '_blank')
  }
}
