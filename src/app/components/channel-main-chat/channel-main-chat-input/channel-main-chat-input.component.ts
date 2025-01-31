import { MessageService } from './../../../services/message-service/message.service';
import { Message } from './../../../../models/message.class';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChannelService } from '../../../services/channel-service/channel.service';

@Component({
  selector: 'app-channel-main-chat-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './channel-main-chat-input.component.html',
  styleUrl: './channel-main-chat-input.component.scss'
})
export class ChannelMainChatInputComponent {

  //todo: create new channelThread, create new Message & getFormInput, setChannelThreadtoChannel, setMessageToChannelThread, addFirstMessageToChannelHeader

  @Output() messageSent = new EventEmitter<string>();
  @Output() newChannelThreadId = new EventEmitter<string>();
  activeUser: any;
  activeChannelId: string = '';

  chatInputForm: FormGroup;

  constructor(private fb: FormBuilder, private channelService: ChannelService, private messageService: MessageService ) {
    this.chatInputForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onSubmit(){
    if(this.chatInputForm.valid){
      const messageData = this.chatInputForm.get('message')?.value;
      // create new Message
      const newMessage = this.messageService.createMessage();
      // create new channelThread
      const newChannelThreadId = this.channelService.createChannelThread()

      // fill Message with inputData
      // store new message into new channelThread
      // send new channelThreadId to parent via Output()
      this.messageSent.emit(messageData)
      this.chatInputForm.reset();
    } else {
      console.error('Form is invalid')
    }
  }

}
