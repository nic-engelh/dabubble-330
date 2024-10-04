import { TestBed } from '@angular/core/testing';
import { ErrorService } from './error.service';
import { NgxNotifierService } from 'ngx-notifier';
import { HttpErrorResponse } from '@angular/common/http';
import { FirebaseError } from 'firebase/app';

describe('ErrorService', () => {
  let service: ErrorService;
  let notifierServiceSpy: jasmine.SpyObj<NgxNotifierService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('NgxNotifierService', ['createToast']);

    TestBed.configureTestingModule({
      providers: [
        ErrorService,
        { provide: NgxNotifierService, useValue: spy }
      ]
    });

    service = TestBed.inject(ErrorService);
    notifierServiceSpy = TestBed.inject(NgxNotifierService) as jasmine.SpyObj<NgxNotifierService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle HttpErrorResponse and show correct notification', () => {
    const httpError = new HttpErrorResponse({ status: 404 });

    service.handleError(httpError);

    expect(notifierServiceSpy.createToast).toHaveBeenCalledWith('The requested resource was not found.', 'error', 3000);
  });

  it('should handle FirebaseError and show correct notification', () => {
    const firebaseError = { code: 'auth/email-already-in-use', message: 'Email already in use' } as FirebaseError;

    service.handleError(firebaseError);

    expect(notifierServiceSpy.createToast).toHaveBeenCalledWith('This email is already in use. Please use a different email.', 'error', 3000);
  });

  it('should handle generic Error and show correct notification', () => {
    const error = new Error('Something went wrong');

    service.handleError(error);

    expect(notifierServiceSpy.createToast).toHaveBeenCalledWith('Something went wrong', 'error', 3000);
  });

  it('should handle unknown error and show default notification', () => {
    const unknownError = 'Unknown error';

    service.handleError(unknownError);

    expect(notifierServiceSpy.createToast).toHaveBeenCalledWith('An unexpected error occurred. Please try again later.', 'error', 3000);
  });

  it('should show success notification', () => {
    service.showSuccessNotification('Operation successful');

    expect(notifierServiceSpy.createToast).toHaveBeenCalledWith('Operation successful', 'success', 3000);
  });

  it('should show info notification', () => {
    service.showInfoNotification('Info message');

    expect(notifierServiceSpy.createToast).toHaveBeenCalledWith('Info message', 'info', 3000);
  });

  it('should show warning notification', () => {
    service.showWarningNotification('Warning message');

    expect(notifierServiceSpy.createToast).toHaveBeenCalledWith('Warning message', 'warning', 3000);
  });
});
