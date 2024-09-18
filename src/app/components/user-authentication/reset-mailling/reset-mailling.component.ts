import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication-service/authentication.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserDataService } from '../../../services/user-data/user-data.service';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';

@Component({
  selector: 'app-reset-mailling',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-mailling.component.html',
  styleUrl: './reset-mailling.component.scss'
})
export class ResetMaillingComponent {

  resetMailForm: FormGroup;
  subscription: Subscription = new Subscription();
  isHidden: boolean = false;
  emailFocused: boolean = false;


  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserDataService,
    private router: Router,
    private auth: Auth
  ) {
    this.resetMailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.resetMailForm.valid) {
      const email = this.resetMailForm.get('email')?.value;
      console.log('Form Submitted', this.resetMailForm.value);


      //* function for sending the reset email from firebase/auth
      //* checking if email exists with in the auth/user-database


      sendPasswordResetEmail(this.auth, email)
      .then(() => {
        console.log("Succesfully send reset e-mail.");

      })
      .catch((error) => {
        console.error(error)
      });


    } else {
      console.log('Form is invalid');
    }
  }



  // Getters for easy access to form fields in the template
  get email() {
    return this.resetMailForm.get('email');
  }

  handleSuccessfulRegister(userName:string) {
    this.userService.updateDisplayName(userName)
    //! change route to avatar-selection
    this.router.navigate(['/auth/log-in']);
  }




}
