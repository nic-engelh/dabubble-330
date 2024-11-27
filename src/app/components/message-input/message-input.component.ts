import { User } from './../../../models/user.class';
import { MessagingService } from './../../services/messaging-service/messaging.service';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Message } from '../../../models/message.class';
import { Conversation } from '../../../models/conversation.class';
import { MessageService } from '../../services/message-service/message.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { ConversationService } from '../../services/conversation-service/conversation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    FormsModule,
    PickerComponent,
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent implements OnInit, OnDestroy {
  // testing
  threadId = '30040944-9e8d-4d01-a84b-a03c70ea58c7'; // Will be given

  // Current logged in and google auth verified User
  currentUser: any | User;
  private conversationSubscription!: Subscription;
  selectedThreadId: string | any;
  chatForm: FormGroup;
  messages: string[] = [];
  // collection "threads"
  // subcollection: "messages"
  // path threads/30040944-9e8d-4d01-a84b-a03c70ea58c7/messages

  // form values = content and user
  formInputValues: any;
  // ACTIVE USER === SENDER
  showEmojiPicker = false;



  constructor(
    private messageService: MessageService,
    private messagingService: MessagingService,
    private fb: FormBuilder,
    private elementRef: ElementRef,
    private authService: AuthenticationService,
    private conversationService: ConversationService
  ) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((fireAuthUser) => {
      this.currentUser = fireAuthUser;
      console.log("from Message-Input: ", this.currentUser);
    });
    this.conversationSubscription = this.conversationService.chatId$.subscribe(
      (updatedChatId) => {
        this.selectedThreadId = updatedChatId;
      }
    );
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    this.formInputValues = (this.formInputValues || '') + event.emoji.native;
    this.showEmojiPicker = false; // Picker nach Auswahl schließen
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.showEmojiPicker = false; // Schließt den Emoji-Picker
    }
  }

  onInputFocus(): void {
    this.showEmojiPicker = false;
  }

  printConsoleLog() {
    console.log('hallo Input', this.formInputValues);
    // input === string;
  }

  sendMessage() {
    if (this.chatForm.valid) {
      const newMessage = this.messageService.createMessage(
        this.selectedThreadId,
        this.formInputValues,
        this.currentUser
      );

      this.messagingService.setMessagetoConversation(this.selectedThreadId, newMessage);
    }
    this.chatForm.reset();
  }

  ngOnDestroy() {
    if (this.conversationSubscription) {
      this.conversationSubscription.unsubscribe();
    }
  }
}
