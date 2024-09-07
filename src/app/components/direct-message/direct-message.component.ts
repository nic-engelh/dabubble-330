import { Component } from '@angular/core';
import { MessageInputComponent } from '../message-input/message-input.component';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [
    MessageInputComponent,
    DirectMessageComponent,
    CommonModule,
    NgFor,
    RouterModule,
  ],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
})
export class DirectMessageComponent {
  constructor(private messages: MessageInputComponent) {}
}
