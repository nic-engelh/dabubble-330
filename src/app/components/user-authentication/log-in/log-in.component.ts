import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
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
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
})
export class LogInComponent {
  loginForm: FormGroup;
  subscription = new Subscription();
  isHidden: boolean = false;
  emailFocused = false;
  passwordFocused = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Function to handle form submission
  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form Submitted', this.loginForm.value);
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      this.authService
        .login(email, password)
        .then((response: any) => {
          const user = response.user;
          const token = response.token;
          console.log('login successful', response);
          console.log('logged-in user:', user);
          this.handleSuccessfulLogin(user);
        })
        .catch((error) => {
          // Handle errors here
          console.error('Login failed:', error.message);
        });
    } else {
      console.log('Form is invalid');
    }
  }

  // Getters for easy access to form fields in the template
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  private handleSuccessfulLogin(user: any) {
    // Save user info or token
    this.authService.setCurrentUser(user);

    // Navigate to main chat page
    this.router.navigate(['/desktop']);
  }
}
