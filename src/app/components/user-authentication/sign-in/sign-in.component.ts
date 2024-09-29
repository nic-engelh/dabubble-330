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
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ModalComponent],
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
  showModal: boolean = false;
  message: string = 'Konto erfolgreich erstellt!';

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserDataService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required, Validators.pattern(/^(?:\p{L}+(?:[',. -]\p{L}+)*)?$/u)]],
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
          this.handleSuccessfulRegister(userName);
        })
        .catch((error) => {
          // Handle errors here
          console.error('Sign-in failed:', error.message);
        });
    } else {
      console.log('Form is invalid');
    }
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


  handleSuccessfulRegister(userName:string) {
    this.userService.updateDisplayName(userName)
    this.showModal = true;
    setTimeout(() => {
      this.showModal = false;
    }, 200);
    //! change route to avatar-selection
    setTimeout(() => {
      this.router.navigate(['/auth/log-in']);
    }, 4000);

  }
}
