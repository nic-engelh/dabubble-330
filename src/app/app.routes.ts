import { PasswordResetComponent } from './components/user-authentication/password-reset/password-reset.component';
import { ResetMaillingComponent } from './components/user-authentication/reset-mailling/reset-mailling.component';
import { AvatarSelectionComponent } from './components/user-authentication/avatar-selection/avatar-selection.component';
import { Routes } from '@angular/router';
import { DirectMessageComponent } from './components/direct-message/direct-message.component';
import { DirectMessageListComponent } from './components/direct-message-list/direct-message-list.component';
import { InConstructionComponent } from './components/in-construction/in-construction.component';
import { DesktopComponent } from './components/desktop/desktop.component';
import { ErrorComponent } from './components/error/error.component';
import { ChannelComponent } from './components/channel/channel.component';
import { TestMessengerComponent } from './components/test-messenger/test-messenger.component';
import { UserAuthenticationComponent } from './components/user-authentication/user-authentication.component';
import { LogInComponent } from './components/user-authentication/log-in/log-in.component';
import { SignInComponent } from './components/user-authentication/sign-in/sign-in.component';
import { ProfilComponent } from './components/profil/profil.component';
import { ProfilEditComponent } from './components/profil-edit/profil-edit.component';
import { ProfilMenuComponent } from './components/profil-menu/profil-menu.component';
import { HeaderComponent } from './components/header/header.component';

export const routes: Routes = [
  {
    path: 'chat/:id',
    component: DirectMessageComponent,
  },
  {
    path: 'channel/:id',
    component: ChannelComponent,
  },
  {
    path: 'construction',
    component: InConstructionComponent,
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path: '',
    component: DesktopComponent,
  },
  {
    path: 'testing',
    component: TestMessengerComponent,
  },
  {
    path: 'auth',
    component: UserAuthenticationComponent,
  },
  {
    path: 'auth',
    component: UserAuthenticationComponent,
    children: [
      { path: 'log-in', component: LogInComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'avatar', component: AvatarSelectionComponent },
      { path: 'reset-mail', component: ResetMaillingComponent },
      { path: 'reset-password', component: PasswordResetComponent }
    ],
  },
  {
    path: 'profil',
    component: ProfilComponent,
  },
  {
    path: 'edit-profil',
    component: ProfilEditComponent,
  },
  {
    path: 'profil-menu',
    component: ProfilMenuComponent,
  },
  {
    path: 'header',
    component: HeaderComponent,
  },

];
