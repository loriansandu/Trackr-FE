import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {UserService} from "../../../services/user/user.service";
import {UserInfo} from "../../../services/user/user";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ProfileComponent implements OnInit, OnDestroy{

  userInfo?: UserInfo;
  firstName!: string ;
  lastName!: string ;
  updateProfileLoading: boolean = false;
  screenWidth!: number;
  removePictureText!: string;
  showPassword: boolean = false;
  passswordInputType: string = 'password';
  uploadPictureText!: string;
  changePasswordDialogVisible: boolean = false;
  changeNumberDialogVisible: boolean = false;
  fieldTextType!: boolean;
  isPasswordInvalid: boolean = false;
  isConfirmPasswordInvalid: boolean = false;
  isNewPasswordInvalid: boolean = false;
  isNumberInvalid: boolean = false;
  selectedFile!: File;
  newPhoneNumber!: string | number;
  updatePasswordLoading: boolean = false;
  updateNumberLoading: boolean = false;
  updateImageLoading: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef;

  changePasswordForm = new FormGroup({
    password: new FormControl(
      '',
      [
        Validators.required,
      ]),
    newPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });
  changeNumberForm  = new FormGroup({
    number: new FormControl(
      '',
      [
        Validators.required,
      ])
  });

  constructor(private userService: UserService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 768 && this.screenWidth < 1200) {
      this.removePictureText = ''
      this.uploadPictureText = ''
    }
    else {
      this.removePictureText = 'Remove'
      this.uploadPictureText = 'Upload'
    }
    window.addEventListener('resize', this.onResize.bind(this));
    this.getUserInfo()
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize.bind(this));
  }
  getUserInfo() {
    this.userService.getUserInfo().subscribe(
      (user : UserInfo) => {
        if(user.profilePicture) {
          user.profilePicture = `data:${user.fileType};base64,${user.profilePicture}`
        }
        else {
          user.profilePicture = user.pictureUrl;
        }
        this.userInfo = user;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
      },
      (error) => {
        console.error('Error fetching user info:', error);
      }
    );
  }
  onUpdateProfileInfo() {
    this.updateProfileLoading = true;
    this.userService.changeNames(this.firstName, this.lastName)
      .subscribe(
        (response) => {
          this.updateProfileLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Name changed successfully',
          });
        },
        (error) => {
          this.updateProfileLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Name change failed',
          });
        }
      );

  }
  onChangePassword() {
    this.updatePasswordLoading = true;
    this.userService.changePassword(this.changePasswordForm.value.password, this.changePasswordForm.value.newPassword)
        .subscribe(
            (response) => {
              this.updatePasswordLoading = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Password changed successfully',
              });
              this.changePasswordDialogVisible = false;
            },
            (error) => {
              this.updatePasswordLoading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Password change failed',
              });
            }
        );
  }
  onChangeNumber() {
    this.updateNumberLoading = true;
    this.userService.changePhoneNumber(this.changeNumberForm.value.number)
        .subscribe(
            (response) => {
              this.updateNumberLoading = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Number changed successfully',
              });
              if (this.userInfo) {
                this.userInfo.phoneNumber = this.changeNumberForm.value.number;
              }
              this.changeNumberDialogVisible = false;
            },
            (error) => {
              console.log(error)
              this.updateNumberLoading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Number change failed',
              });
            }
        );
  }
  onUploadProfilePicture(): void {
    if (this.selectedFile) {
      this.updateImageLoading = true;
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.userService.uploadProfilePicture(formData).subscribe(
          {
            next : (response) => {
              console.log(response)
              this.updateImageLoading = false;
              this.setCurrentProfileImage(this.selectedFile);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Photo uploaded successfully',
              });

            },
            error : (error) => {
              this.updateImageLoading = false;
              this.messageService.add({
                severity: 'error',
                summary: error,
                detail: 'Photo upload failed',
              });
            }
          }
      )
    }
  }

  setCurrentProfileImage(selectedFile: File) {
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      if (this.userInfo)
      this.userInfo.profilePicture = reader.result as string;
    };
  }

  getRemovePictureStyleClass(): string {
    return (this.screenWidth > 768 && this.screenWidth < 1200) ? 'p-button-outlined p-button-danger pi pi-times-circle' : 'p-button-outlined p-button-danger';
  }
  getUploadPictureStyleClass(): string {
    if(this.updateImageLoading) {
      return 'p-button-outlined p-button-secondary upload-button'
    }
    else {
      return (this.screenWidth > 768 && this.screenWidth < 1200) ? 'p-button-outlined p-button-secondary upload-button pi pi-upload' : 'p-button-outlined p-button-secondary upload-button';
    }
  }
  onResize(event: Event): void {
    this.screenWidth = window.innerWidth;
    this.removePictureText =
      this.screenWidth > 768 && this.screenWidth < 1200 ? '' : 'Remove';
    this.uploadPictureText =
      this.screenWidth > 768 && this.screenWidth < 1200 ? '' : 'Upload';
  }

  showPasswordDialog() {
    this.changePasswordDialogVisible = true;
  }
  getPasswordError() {
    return this.changePasswordForm.controls.password.hasError('required') ?
      "Password is required." : ''
  }
  getConfirmPasswordError() {
    return this.changePasswordForm.controls.confirmPassword.hasError('required') ?
      "This field is required." :
      this.changePasswordForm.controls.confirmPassword.value !== this.changePasswordForm.controls.newPassword.value ?
        "Passwords do not match." : '';
  }
  getNewPasswordError() {
    return this.changePasswordForm.controls.confirmPassword.hasError('required') ?
      "This field is required." : ''
  }
  onPasswordFocusOut() {
    this.isPasswordInvalid = this.changePasswordForm.controls.password.hasError('required') ||
      (this.changePasswordForm.controls.password.hasError('pattern'));
  }
  onConfirmPasswordFocusOut() {
    this.isConfirmPasswordInvalid = this.changePasswordForm.controls.confirmPassword.hasError('required') ||
      this.changePasswordForm.controls.confirmPassword.value !== this.changePasswordForm.controls.newPassword.value;
  }
  onNewPasswordFocusOut() {
    this.isNewPasswordInvalid = this.changePasswordForm.controls.newPassword.hasError('required')
  }
  resetForm() {
    this.isNewPasswordInvalid = this.isConfirmPasswordInvalid = this.isPasswordInvalid  = this.isNumberInvalid = false;
    this.changePasswordForm.reset();
    this.newPhoneNumber = ''
  }

  showNumberDialog() {
    this.changeNumberDialogVisible = true;
  }

  changePassword(){
    this.onPasswordFocusOut()
    this.onConfirmPasswordFocusOut()
    this.onNewPasswordFocusOut()

    if (this.isPasswordInvalid || this.isConfirmPasswordInvalid || this.isNewPasswordInvalid)
      return;
    // this.submitted = true;
    this.onChangePassword();

  }
  changeNumber() {
    this.isNumberInvalid = this.changeNumberForm.controls.number.hasError('required')
    if (this.isNumberInvalid)
      return;
    this.onChangeNumber()
  }

  getNumberError() {
    return this.changeNumberForm.controls.number.hasError('required') ?
      "This field is required." : ''
  }


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    const maxSizeBytes = 10 * 1024 * 1024; // 5MB in bytes
    if (this.selectedFile && this.selectedFile.size > 0) {
      if (this.selectedFile.size <= maxSizeBytes) {
        this.onUploadProfilePicture();
      } else {
        this.messageService.add({
          severity: 'error',
          detail: 'File size exceeds the 5MB limit.',
        });

      }
    }

  }


  onRemoveProfilePicture() {
    this.userService.removeProfilePicture().subscribe(
        {
          next : (response) => {
            console.log(response)
            if (this.userInfo) {
              this.userInfo.profilePicture = null;
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Photo removed successfully',
            });

          },
          error : (error) => {
            console.log(error)
            this.messageService.add({
              severity: 'error',
              summary: error,
              detail: 'Photo remove failed',
            });
          }
        }
    )
  }
  confirmRemovePicture(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete the photo?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onRemoveProfilePicture();
      },
      reject: () => {
      }
    });
  }

}
