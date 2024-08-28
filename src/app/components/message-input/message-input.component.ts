import { MessagingService } from './../../services/messaging-service/messaging.service';
import { Component, OnInit } from '@angular/core';
import { Message } from '../../../models/message.class';
import { Conversation } from '../../../models/conversation.class';
import { User } from '../../../models/user.class';
import { MessageService } from '../../services/message-service/message.service';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent implements OnInit {

  threadId = '30040944-9e8d-4d01-a84b-a03c70ea58c7'; // Will be given
  // collection "threads"
  // subcollection: "messages"
  // path threads/30040944-9e8d-4d01-a84b-a03c70ea58c7/messages

  // form values = content and user
  formInputValues: any;

  constructor( private messageService: MessageService, private messagingService: MessagingService) {}

  ngOnInit(): void {}


  sendMessage () {

    let newMessage: any; // Message Datatyp

    newMessage = this.messageService.createMessage(this.formInputValues);

    this.messagingService.setMassagetoConversation(this.threadId, newMessage);
  }

}
