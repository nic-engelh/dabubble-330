import { Component } from '@angular/core';
import { MainChatComponent } from '../main-chat/main-chat.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { DirectMessageComponent } from '../direct-message/direct-message.component';
import { MessageInputComponent } from '../message-input/message-input.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [
    MainMenuComponent,
    DirectMessageComponent,
    MessageInputComponent,
    RouterOutlet,
  ],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.scss',
})
export class DesktopComponent {}
