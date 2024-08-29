import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestMessengerComponent } from './components/test-messenger/test-messenger.component';
import { MessageInputComponent } from "./components/message-input/message-input.component";
import { DirectMessageListComponent } from './components/direct-message-list/direct-message-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TestMessengerComponent, MessageInputComponent, DirectMessageListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'daBubble';
}
