import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {Observable} from "rxjs";
import {UserInfo} from "./user";
import {environment} from "../../../environments/environment";
import {FormControl, ɵValue} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) {
    // this.validateToken().then(() => {});
  }

  getUserInfo(): Observable<UserInfo> {
    let requestPath: string = environment.apiUrl + `/api/user`;
    return this.http.get<UserInfo>(requestPath);
  }
  changePassword(currentPassword: ɵValue<FormControl<string | null>> | undefined, newPassword: ɵValue<FormControl<string | null>> | undefined): Observable<any> {
    let requestPath: string = environment.apiUrl + `/api/user/change-password`;
    return this.http.put(requestPath, { password: currentPassword, newPassword: newPassword });
  }
  changePhoneNumber(number: ɵValue<FormControl<string | null>> | undefined): Observable<any> {
    let requestPath: string = environment.apiUrl + `/api/user/change-number`;
    return this.http.put(requestPath, number);
  }
  changeNames(firstName: string, lastName: string) {
    let requestPath: string = environment.apiUrl + `/api/user/change-name`;
    return this.http.put(requestPath, {firstName, lastName});
}
  uploadProfilePicture(file: FormData): Observable<any> {
    let requestPath: string = environment.apiUrl + `/api/user/upload-profile-picture`;
    return this.http.put(requestPath, file);
  }

  removeProfilePicture() {
    let requestPath: string = environment.apiUrl + `/api/user/delete-profile-picture`;
    return this.http.delete(requestPath);
  }
}
