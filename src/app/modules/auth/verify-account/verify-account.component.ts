import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {animate, state, style, transition, trigger} from "@angular/animations";


@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', animate('100ms ease-out', style({ opacity: 0 }))),
    ]),
  ],
})
export class VerifyAccountComponent implements OnInit{
  correctCode: boolean | undefined;
  constructor(private authService: AuthService, private router: Router) {}
  @Input() email!: string;
  @Input() sendCode!: boolean;
  @Output() triggerCorrectCode = new EventEmitter();
  resentCode: boolean | undefined;
  loading: boolean = false;
  onSendVerificationCode(code: number) {
    const inputCodeBoxes = Array.from(
      document.getElementsByClassName('validation-code-input') as HTMLCollectionOf<HTMLElement>,
    );

    this.authService.sendVerificationCode(code, this.email).subscribe(
      () => {
        console.log('Validation successful');
        this.correctCode = true;
        inputCodeBoxes.forEach(box => {
          box.classList.add('correct-code');
        });
        setTimeout(() => {
          this.triggerCorrectCode.emit();
        }, 1000);
      },
      (error : HttpErrorResponse) => {
        console.error('Code verification failed', error);
        this.correctCode = false;
        inputCodeBoxes.forEach(box => {
          box.classList.add('incorrect-code');
        });
      }
    );
  }
  resendCode(notification : boolean) {
    this.resentCode = false
    this.loading = notification
    this.authService.resendVerificationCode(this.email).subscribe(
      () => {
        this.resentCode = notification;
        this.loading = false
        console.log('Code sent to email');
      },
      (error) => {
        this.loading = false
        console.error('Could not send new code', error);
      }
    );
  }
  onOtpChange(otp: string) {
    if (otp.length === 5) {
      this.onSendVerificationCode(parseInt(otp));
    }
    if (otp.length === 4) {
      this.correctCode = undefined;
      const inputCodeBoxes = Array.from(
        document.getElementsByClassName('validation-code-input') as HTMLCollectionOf<HTMLElement>,
      );
      inputCodeBoxes.forEach(box => {
        box.classList.remove('correct-code');
        box.classList.remove('incorrect-code');
      });
    }
  }

  ngOnInit(): void {
    this.sendCode ? this.resendCode(false) : ''
  }

}
