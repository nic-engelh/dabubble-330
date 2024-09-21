import { UserDataService } from './../../../services/user-data/user-data.service';
import { Component, OnInit } from '@angular/core';
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
import { RouterModule, Router, Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent implements OnInit {
  resetPasswordForm: FormGroup;
  subscription: Subscription = new Subscription();
  passwordFocused: boolean = false;
  actionCode: string | null = null;
  message: string = '';
  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordConfirmation: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // Get the action code from the URL
    this.actionCode = this.route.snapshot.queryParamMap.get('oobCode');
    if (!this.actionCode) {
      this.message = 'Invalid password reset link.';
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('passwordConfirmation')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  verifyActionCode() {
    if (this.actionCode) {
      this.userService
        .verifyPasswordResetCode(this.actionCode)
        .then((email: string) => {
          this.email = email;
        })
        .catch((error) => {
          this.message = `Error: ${error.message}`;
        });
    }
  }

  async onSubmit() {
    if (this.resetPasswordForm.valid && this.actionCode) {
      const newPassword = this.resetPasswordForm.get('password')?.value;

      this.userService
        .confirmPasswordReset(this.actionCode, newPassword)
        .then(() => {
          this.message = 'Your password has been reset successfully.';
          setTimeout(() => {
            //! show modal email changed
            this.router.navigate(['/login']);
          }, 3000);
        })
        .catch((error: any) => {
          this.message = `Error: ${error.message}`;
          //? reroute and send error message to error compoente to show it the user
          this.router.navigate(['/error'], {
            state: { error: error.message },
          });
        });
    }
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }
}
