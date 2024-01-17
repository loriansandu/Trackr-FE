import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {catchError, tap} from "rxjs/operators";
import {FormControl, ɵValue} from "@angular/forms";
import {EMPTY, lastValueFrom, Observable, throwError} from "rxjs";
import {MessageService} from "primeng/api";
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  private authenticated : boolean = false;
  private register: boolean = false;
  public username!: string;

  constructor(private http: HttpClient,
              private router: Router,
              private messageService: MessageService,
              private socialAuthService: SocialAuthService
  ) {
    // this.validateToken().then(() => {});
  }

  login(email: ɵValue<FormControl<string | null>> | undefined, password: ɵValue<FormControl<string | null>> | undefined) : Observable<boolean>{

    let requestPath: string = environment.apiUrl + `/api/auth/login`;

    return this.http.post(requestPath, {email: email, password: password}).pipe(
      tap((res: any) => {
        sessionStorage.setItem("token", res.token);
        this.authenticated = true;
        this.register = false;
        this.router.navigateByUrl("/kineto").then(() => {});
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(err);
      })
    );
  }

  loginWithGoogle(idToken: string) {
    let requestPath: string = environment.apiUrl + `/api/auth/google`;

    return this.http.post<any>(requestPath, idToken).pipe(
      catchError((err: HttpErrorResponse) => {
        // Handle errors here, e.g., log them or show error messages
        return throwError(err);
      }),
      tap((res: any) => {
        sessionStorage.setItem("token", res.token);
        this.authenticated = true;
        this.router.navigateByUrl("/kineto").then(() => {});
      })
    );
  }
  sendVerificationCode(code: number, email: ɵValue<FormControl<string | null>> | undefined) : Observable<boolean> {
    let requestPath: string = environment.apiUrl + `/api/auth/confirm-account`;
    return this.http.post(requestPath, {token: code.toString(), email}).pipe(

      catchError((err: HttpErrorResponse) => {
        return throwError(err);
      }),
      tap((res: any) => {
        // sessionStorage.setItem("token", res.token);
        // this.authenticated = true;
        // this.register = false;
      })
    );
  }
  logout(){
    sessionStorage.removeItem("token");
    this.authenticated = false;
    this.router.navigateByUrl("/auth").then(r => {});
    this.socialAuthService.authState.subscribe(
        (user) => {
          // Handle user authentication state changes here
          if (user) {
            this.socialAuthService.signOut(true).finally();
          }
        }
    );

  }

  isAuthenticated(){
    return this.authenticated;
  }


  signUp(email: ɵValue<FormControl<string | null>> | undefined, password: ɵValue<FormControl<string | null>> | undefined): Observable<boolean> {
    let requestPath: string = environment.apiUrl + `/api/auth/register`;

    return this.http.post<any>(requestPath, { email, password }).pipe(
      catchError((err: HttpErrorResponse) => {
        // Handle errors here, e.g., log them or show error messages
        return throwError(err);
      }),
      tap((res: any) => {
        // Handle successful registration here

      })
    );
  }

  async validateToken() {
    try {
      const tokenValidation$ = this.http.get(environment.apiUrl + "/api/auth/validate").pipe(
        tap(() => {
          this.authenticated = true;
        
        }),
        catchError((err: any) => {
          // this.logout();
          return EMPTY;
        }),
      );
      await lastValueFrom(tokenValidation$);
    } catch (e) {}
  }

  resendVerificationCode(email: ɵValue<FormControl<string | null>> | undefined): Observable<boolean> {
    let requestPath: string = environment.apiUrl + `/api/auth/resend-verification-code`;

    return this.http.post<any>(requestPath, {email}).pipe(
      catchError((err: HttpErrorResponse) => {
        // Handle errors here, e.g., log them or show error messages
        return throwError(err);
      }),
      tap((res: any) => {
        // Handle successful registration here
      })
    );
  }

  resetPassword(email: ɵValue<FormControl<string | null>> | undefined) {
    let requestPath: string = environment.apiUrl + `/api/auth/reset-password`;

    return this.http.post<any>(requestPath, {email}).pipe(
      catchError((err: HttpErrorResponse) => {
        // Handle errors here, e.g., log them or show error messages
        return throwError(err);
      }),
      tap((res: any) => {
        // Handle successful registration here
      })
    );
  }


}
