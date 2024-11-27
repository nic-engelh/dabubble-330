import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { UserDataService } from '../../services/user-data/user-data.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorService } from '../../services/error-service/error.service';

@Component({
  selector: 'app-profil-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profil-edit.component.html',
  styleUrl: './profil-edit.component.scss',
})
export class ProfilEditComponent implements OnInit {
  /**
   * Reference to the profile edit dialog element in the template.
   * @type {ElementRef}
   */
  @ViewChild('profilEditDialog') profilEditDialog!: ElementRef;

  /**
   * Indicates whether the profile edit dialog is visible.
   * @type {boolean}
   */
  isVisible: boolean = false;

  /**
   * Path to the close icon image.
   * @type {string}
   */
  closeIconPath: string = '/assets/img/close-default.svg';

  /**
   * Indicates whether the user is a member.
   * @type {boolean}
   */
  isMember: boolean = true;

  /**
   * Indicates whether the user is a regular user.
   * @type {boolean}
   */
  isUser: boolean = true;

  /**
   * The current user object.
   * @type {any}
   */
  currentUser: any;

  /**
   * The current status of the user.
   * @type {string}
   */
  userStatus: string = 'Abwesend';

  /**
   * Indicates whether the user is active.
   * @type {boolean}
   */
  isActive: boolean = true;

  /**
   * Form group for changing profile data.
   * @type {FormGroup}
   */
  changeProfilDataForm: FormGroup;

  /**
   * Indicates whether the email input field is focused.
   * @type {boolean}
   */
  emailFocused: boolean = false;

  /**
   * Indicates whether the name input field is focused.
   * @type {boolean}
   */
  nameFocused: boolean = false;

  /**
   * Constructor for the component.
   * @param {AuthenticationService} authService - Service for authentication-related operations.
   * @param {FormBuilder} fb - FormBuilder service for creating form controls.
   * @param {UserDataService} userDataService - Service for user data operations.
   * @param {ErrorService} errorHandlingService - Service for handling errors.
   * @param {Router} router - Angular Router for navigation.
   */
  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private errorHandlingService: ErrorService,
    private router: Router
  ) {
    /**
     * Initializes the form group for changing profile data.
     */
    this.changeProfilDataForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?:\p{L}+(?:[',. -]\p{L}+)*)?$/u),
        ],
      ],
    });
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    /**
     * Fetches the current user data and assigns it to the `currentUser` property.
     */
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser);
    });
  }

  /**
   * Handles the form submission for updating user profile data.
   * @returns {Promise<void>}
   */
  async onSubmit(): Promise<void> {
    if (this.changeProfilDataForm.invalid) {
      this.errorHandlingService.showWarningNotification(
        'Eingabe ist ungültig.'
      );
      Object.values(this.changeProfilDataForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    const newEmail = this.changeProfilDataForm.get('email')?.value;
    const newUserName = this.changeProfilDataForm.get('name')?.value;

    if (!newEmail || !newUserName || !this.currentUser) {
      this.errorHandlingService.handleError(
        new Error('Missing form data or current user')
      );
      return;
    }

    try {
      await this.updateUserProfile(newUserName, newEmail);
      this.resetAllFields();
      this.errorHandlingService.showSuccessNotification(
        'Profil erfolgreich aktualisiert.'
      );
      // close profil edit dialog
      // Optionally, show a success message or navigate to another page
    } catch (error) {
      this.errorHandlingService.handleError(error);
      console.error('Error Zweig');
      this.resetAllFields();
      // close proifl edit dialog
    }
    this.cancelEditProfil();
  }

  /**
   * Updates the user's profile with the new username and email.
   * @param {string} newUserName - The new username.
   * @param {string} newEmail - The new email.
   * @returns {Promise<void>}
   */
  private async updateUserProfile(
    newUserName: string,
    newEmail: string
  ): Promise<void> {
    await this.userDataService.updateDisplayName(newUserName);
    await this.userDataService.updateEmail(newEmail);
  }

  /**
   * Getter for easy access to the email form control in the template.
   * @returns {AbstractControl | null}
   */
  get email() {
    return this.changeProfilDataForm.get('email');
  }

  /**
   * Getter for easy access to the name form control in the template.
   * @returns {AbstractControl | null}
   */
  get name() {
    return this.changeProfilDataForm.get('name');
  }

  /**
   * Resets all form fields to their initial state.
   */
  resetAllFields() {
    this.changeProfilDataForm.reset();
  }

  /**
   * Cancels the profile editing process and hides the profile edit dialog.
   */
  cancelEditProfil() {
    this.isVisible = false;
  }
}
