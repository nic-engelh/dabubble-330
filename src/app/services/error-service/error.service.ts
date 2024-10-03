import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

// Custom error type for user update errors
export type UserUpdateError = {
  code: string;
  message: string;
};

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  //! change MatSnackbar to ngx-toastr
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else if (this.isUserUpdateError(error)) {
      this.handleUserUpdateError(error);
    } else {
      this.handleUnexpectedError(error);
    }
  }

  private handleHttpError(error: HttpErrorResponse): void {
    console.error(`HTTP error: ${error.status} ${error.statusText}`);
    let message = 'An error occurred while communicating with the server.';
    if (error.status === 404) {
      message = 'The requested resource was not found.';
    } else if (error.status === 403) {
      message = 'You do not have permission to perform this action.';
    }
    this.showErrorMessage(message);
  }

  private handleUserUpdateError(error: UserUpdateError): void {
    console.error(`Update error: ${error.code} - ${error.message}`);
    this.showErrorMessage(`Failed to update profile: ${error.message}`);
  }

  private handleUnexpectedError(error: unknown): void {
    console.error('An unexpected error occurred:', error);
    this.showErrorMessage('An unexpected error occurred. Please try again later.');
  }

  private isUserUpdateError(error: any): error is UserUpdateError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error
    );
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
