import { Component, OnInit } from '@angular/core';
import { Message } from '../../../models/message.class';
import { Conversation } from '../../../models/conversation.class';
import { User } from '../../../models/user.class';
import { MessagingService } from '../../services/messaging-service/messaging.service';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent implements OnInit {
  ngOnInit(): void {}
  threadId = '30040944-9e8d-4d01-a84b-a03c70ea58c7';
  // collection "threads"
  // subcollection: "messages"
  // path threads/30040944-9e8d-4d01-a84b-a03c70ea58c7/messages
}
