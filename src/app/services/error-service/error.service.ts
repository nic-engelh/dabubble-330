import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FirebaseError } from 'firebase/app';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {


  constructor( private notifier: ToastrService) {
  }

  setNotifierService(notifier: ToastrService) {
    this.notifier = notifier;
  }

  handleError(error: unknown): void {
    console.error('An error occurred:', error);

    let message: string;

    if (error instanceof HttpErrorResponse) {
      message = this.getHttpErrorMessage(error);
    } else if (error instanceof FirebaseError) {
      message = this.getFirebaseErrorMessage(error);
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = 'An unexpected error occurred. Please try again later.';
    }

    this.showErrorNotification(message);
  }

  private getHttpErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Forbidden. You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return `An error occurred while communicating with the server. Status: ${error.status}`;
    }
  }

  private getFirebaseErrorMessage(error: FirebaseError): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already in use. Please use a different email.';
      case 'auth/weak-password':
        return 'The password is too weak. Please choose a stronger password.';
      case 'auth/user-not-found':
        return 'No user found with this email. Please check your email or sign up.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-email':
        return 'The email address is not valid. Please enter a valid email.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/requires-recent-login':
        return 'This operation is sensitive and requires recent authentication. Please log in again.';
      case 'auth/popup-closed-by-user':
        return 'The popup was closed before completing the sign in process. Please try again.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for OAuth operations. Please contact support.';
      case 'auth/operation-not-allowed':
        return 'This operation is not allowed. Please contact support.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  }

  showErrorNotification(message: string): void {
    this.notifier.error(message, 'Error', {positionClass: 'toast-bottom-center',});
  }

  showSuccessNotification(message: string): void {
    this.notifier.success(message, 'Success', {positionClass: 'toast-bottom-center',});
  }

  showInfoNotification(message: string): void {
    this.notifier.info(message, 'Info', {positionClass: 'toast-bottom-center',});
  }

  showWarningNotification(message: string): void {
    this.notifier.warning(message, 'Warning', {positionClass: 'toast-bottom-center',} );
  }

}
