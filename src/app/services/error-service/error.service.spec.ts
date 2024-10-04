import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { FirebaseError } from 'firebase/app';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ToastrService', ['error', 'success', 'info', 'warning']);

    TestBed.configureTestingModule({
      providers: [
        ErrorService,
        { provide: ToastrService, useValue: spy }
      ]
    });

    service = TestBed.inject(ErrorService);
    toastrSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle HttpErrorResponse', () => {
    const httpError = new HttpErrorResponse({ status: 404 });
    service.handleError(httpError);
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'The requested resource was not found.',
      'Error',
      { positionClass: 'toast-bottom-center' }
    );
  });

  it('should handle FirebaseError', () => {
    const firebaseError = { code: 'auth/email-already-in-use' } as FirebaseError;
    service.handleError(firebaseError);
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'This email is already in use. Please use a different email.',
      'Error',
      { positionClass: 'toast-bottom-center' }
    );
  });

  it('should handle generic Error', () => {
    const genericError = new Error('Test error');
    service.handleError(genericError);
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'Test error',
      'Error',
      { positionClass: 'toast-bottom-center' }
    );
  });

  it('should handle unknown error', () => {
    const unknownError = 'Some unknown error';
    service.handleError(unknownError);
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'An unexpected error occurred. Please try again later.',
      'Error',
      { positionClass: 'toast-bottom-center' }
    );
  });

  it('should show success notification', () => {
    service.showSuccessNotification('Success message');
    expect(toastrSpy.success).toHaveBeenCalledWith(
      'Success message',
      'Success',
      { positionClass: 'toast-bottom-center' }
    );
  });

  it('should show info notification', () => {
    service.showInfoNotification('Info message');
    expect(toastrSpy.info).toHaveBeenCalledWith(
      'Info message',
      'Info',
      { positionClass: 'toast-bottom-center' }
    );
  });

  it('should show warning notification', () => {
    service.showWarningNotification('Warning message');
    expect(toastrSpy.warning).toHaveBeenCalledWith(
      'Warning message',
      'Warning',
      { positionClass: 'toast-bottom-center' }
    );
  });

  it('should set notifier service', () => {
    const newNotifier = jasmine.createSpyObj('NewToastrService', ['error']);
    service.setNotifierService(newNotifier);

    const genericError = new Error('Test error');
    service.handleError(genericError);

    expect(newNotifier.error).toHaveBeenCalledWith(
      'Test error',
      'Error',
      { positionClass: 'toast-bottom-center' }
    );
  });
});
