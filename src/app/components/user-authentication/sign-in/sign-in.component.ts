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

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  signInForm: FormGroup;
  subscription: Subscription = new Subscription();
  isHidden: boolean = false;
  emailFocused: boolean = false;
  passwordFocused: boolean = false;
  nameFocused: boolean = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required] ],
    });
  }

  onSubmit() {
    if (this.signInForm.valid) {
      const email = this.signInForm.get('email')?.value;
      const password = this.signInForm.get('password')?.value;
      const userName = this.signInForm.get('name')?.value;
      console.log('Form Submitted', this.signInForm.value);
      this.authService
        .register(email, password)
        .then((response: any) => {
          const user = response.user;
          const token = response.token;
          console.log('sign-in successful', response);
          console.log('signed-in user:', user);
          this.handleSuccessfulRegister();
        })
        .catch((error) => {
          // Handle errors here
          console.error('Sign-in failed:', error.message);
        });
    } else {
      console.log('Form is invalid');
    }

    // navigate to AvatarSelection

  }



  // Getters for easy access to form fields in the template
  get email() {
    return this.signInForm.get('email');
  }
  get password() {
    return this.signInForm.get('password');
  }
  get name() {
    return this.signInForm.get('name');
  }


  handleSuccessfulRegister() {

    this.router.navigate(['/auth/log-in']);
  }


}
