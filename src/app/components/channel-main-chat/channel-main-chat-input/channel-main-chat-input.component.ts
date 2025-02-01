import { MessageInputComponent } from './../../message-input/message-input.component';
import { MessagingService } from './../../../services/messaging-service/messaging.service';
import { MessageService } from './../../../services/message-service/message.service';
import { Message } from './../../../../models/message.class';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChannelService } from '../../../services/channel-service/channel.service';
import { ErrorService } from '../../../services/error-service/error.service';

@Component({
  selector: 'app-channel-main-chat-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './channel-main-chat-input.component.html',
  styleUrl: './channel-main-chat-input.component.scss',
})
export class ChannelMainChatInputComponent {
  //todo: create new channelThread, create new Message & getFormInput, setChannelThreadtoChannel, setMessageToChannelThread, addFirstMessageToChannelHeader

  @Output() messageSent = new EventEmitter<string>();
  @Output() newChannelThreadId = new EventEmitter<string>();
  activeUser: any;
  activeChannelId: string = '';

  chatInputForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private channelService: ChannelService,
    private messageService: MessageService,
    private messagingService: MessagingService,
    private errorService: ErrorService
  ) {
    this.chatInputForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.chatInputForm.valid) {
      console.error('Form is invalid');
      this.errorService.showErrorNotification('Please enter a valid message');
      return;
    }

    try {
      const messageData = this.chatInputForm.get('message')?.value;
      // create new channelThread
      const returnedChannelThreadId =
        await this.channelService.createChannelThread(
          this.activeChannelId,
          this.activeUser
        );
      // create new Message and fill message with inputData
      const newMessage = this.messageService.createMessage(
        returnedChannelThreadId,
        messageData,
        this.activeUser
      );

      // store new message into new channelThread (add Doc to SubSubcollection)
      await this.messagingService.setMessagetoChannelThread(
        this.activeChannelId,
        returnedChannelThreadId,
        newMessage
      );

      // add first message to conversation.firstMessage[]
      await this.messagingService.setMessageToChannelThreadFirstMessage(
        this.activeChannelId,
        returnedChannelThreadId,
        newMessage
      );

      // send new channelThreadId to parent via Output()
      this.newChannelThreadId.emit(returnedChannelThreadId);
      this.chatInputForm.reset();
    } catch (error) {

    }

  }
}
