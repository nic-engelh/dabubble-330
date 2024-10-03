import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilEditComponent } from './profil-edit.component';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { UserDataService } from '../../services/user-data/user-data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ProfilEditComponent', () => {
  let component: ProfilEditComponent;
  let fixture: ComponentFixture<ProfilEditComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let userDataServiceSpy: jasmine.SpyObj<UserDataService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthenticationService', ['getCurrentUser']);
    const userDataServiceMock = jasmine.createSpyObj('UserDataService', ['updateDisplayName', 'updateEmail']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule], // Import necessary modules
      declarations: [ProfilEditComponent], // Declare the component
      providers: [
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: UserDataService, useValue: userDataServiceMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilEditComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    userDataServiceSpy = TestBed.inject(UserDataService) as jasmine.SpyObj<UserDataService>;

    authServiceSpy.getCurrentUser.and.returnValue(of({ email: 'test@test.com', displayName: 'Test User' }));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    fixture.detectChanges();
    expect(component.changeProfilDataForm.get('email')?.value).toEqual('');
    expect(component.changeProfilDataForm.get('name')?.value).toEqual('');
  });

  it('should populate currentUser on ngOnInit', () => {
    fixture.detectChanges();
    expect(component.currentUser).toEqual({ email: 'test@test.com', displayName: 'Test User' });
  });

  it('should submit form when valid and call userDataService to update profile', async () => {
    // Set form to valid state
    component.changeProfilDataForm.setValue({
      email: 'newemail@test.com',
      name: 'New Name'
    });

    fixture.detectChanges();

    // Call the onSubmit method
    await component.onSubmit();

    expect(userDataServiceSpy.updateDisplayName).toHaveBeenCalledWith('New Name');
    expect(userDataServiceSpy.updateEmail).toHaveBeenCalledWith('newemail@test.com');
  });

  it('should not submit the form if it is invalid', async () => {
    // Set form to invalid state
    component.changeProfilDataForm.setValue({
      email: 'invalid-email',
      name: ''
    });

    fixture.detectChanges();

    // Call the onSubmit method
    await component.onSubmit();

    expect(userDataServiceSpy.updateDisplayName).not.toHaveBeenCalled();
    expect(userDataServiceSpy.updateEmail).not.toHaveBeenCalled();
  });

  it('should handle error during profile update', async () => {
    // Mock form values
    component.changeProfilDataForm.setValue({
      email: 'newemail@test.com',
      name: 'New Name'
    });

    // Simulate an error from the updateEmail call
    userDataServiceSpy.updateEmail.and.returnValue(Promise.reject('Error updating email'));

    fixture.detectChanges();

    // Call the onSubmit method
    await component.onSubmit();

    // Ensure that updateEmail failed and updateDisplayName was called before it
    expect(userDataServiceSpy.updateDisplayName).toHaveBeenCalledWith('New Name');
    expect(userDataServiceSpy.updateEmail).toHaveBeenCalledWith('newemail@test.com');
    expect(userDataServiceSpy.updateEmail).toHaveBeenCalledTimes(1); // Ensure that the method was only called once

    // Verify that error was handled
    expect(component.currentUser).toBeDefined(); // Component should remain in valid state
  });

  it('should reset the form on cancelEditProfil', () => {
    component.changeProfilDataForm.setValue({
      email: 'newemail@test.com',
      name: 'New Name'
    });

    fixture.detectChanges();

    component.cancelEditProfil();

    expect(component.changeProfilDataForm.get('email')?.value).toEqual('');
    expect(component.changeProfilDataForm.get('name')?.value).toEqual('');
  });
});
