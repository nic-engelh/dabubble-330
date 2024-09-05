import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ResetMaillingComponent } from './reset-mailling/reset-mailling.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AvatarSelectionComponent } from './avatar-selection/avatar-selection.component';


@Component({
  selector: 'app-user-authentication',
  standalone: true,
  imports: [RouterModule, LogInComponent, SignInComponent, ResetMaillingComponent, PasswordResetComponent, AvatarSelectionComponent],
  templateUrl: './user-authentication.component.html',
  styleUrl: './user-authentication.component.scss'
})
export class UserAuthenticationComponent {

}
