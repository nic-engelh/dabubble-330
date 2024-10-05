import { RouterModule, Router  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  isMember: boolean = true;
  isUser: boolean = true;
  currentUser: any;
  userStatus: string = 'Abwesend';
  isActive: boolean = true;

  changeProfilDataForm: FormGroup;
  emailFocused: boolean = false;
  nameFocused: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private errorHandlingService: ErrorService,
    private router: Router,
  ) {
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

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser);
    });
  }

  async onSubmit(): Promise<void> {
    if (this.changeProfilDataForm.invalid) {
      this.errorHandlingService.showWarningNotification('Eingabe ist ungültig.')
      Object.values(this.changeProfilDataForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    const newEmail = this.changeProfilDataForm.get('email')?.value;
    const newUserName = this.changeProfilDataForm.get('name')?.value;

    if (!newEmail || !newUserName || !this.currentUser) {
      this.errorHandlingService.handleError(new Error("Missing form data or current user"));
      return;
    }

    try {
      await this.updateUserProfile(newUserName, newEmail);
      this.resetAllFields;
      this.errorHandlingService.showSuccessNotification('Profil erfolgreich aktualisiert.');
      this.router.navigate(['/profil']);
      // Optionally, show a success message or navigate to another page
    } catch (error) {
      this.errorHandlingService.handleError(error);
      this.resetAllFields;
    }
  }

  private async updateUserProfile(newUserName: string, newEmail: string): Promise<void> {
    await this.userDataService.updateDisplayName(newUserName);
    await this.userDataService.updateEmail(newEmail);
  }

  // Getters for easy access to form fields in the template
  get email() {
    return this.changeProfilDataForm.get('email');
  }
  get name() {
    return this.changeProfilDataForm.get('name');
  }

  resetAllFields() {
    this.changeProfilDataForm.reset();
  }

  cancelEditProfil() {
    this.changeProfilDataForm.reset();
    this.router.navigate(['/desktop']);
  }
}
