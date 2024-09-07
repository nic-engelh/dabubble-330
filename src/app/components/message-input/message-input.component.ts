import { User } from './../../../models/user.class';
import { MessagingService } from './../../services/messaging-service/messaging.service';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Message } from '../../../models/message.class';
import { Conversation } from '../../../models/conversation.class';
import { MessageService } from '../../services/message-service/message.service';
import { FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule, RouterModule],
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
  user = new User(); //user wird übergeben
  // ACTIVE USER === SENDER
  constructor(
    private messageService: MessageService,
    private messagingService: MessagingService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  printConsoleLog() {
    console.log('hallo Input', this.formInputValues);
    // input === string;
  }

  sendMessage() {
    const newMessage = this.messageService.createMessage(
      this.threadId,
      this.formInputValues,
      this.user
    );

    this.messagingService.setMessagetoConversation(this.threadId, newMessage);
  }

  //function getUserSender(){}
  // function needs to find Sender from Conversation => active USER === Sender
}
