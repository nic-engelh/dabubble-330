import { MessageInputComponent } from './../../message-input/message-input.component';
import { MessagingService } from './../../../services/messaging-service/messaging.service';
import { MessageService } from './../../../services/message-service/message.service';
import { Message } from './../../../../models/message.class';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, input, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChannelService } from '../../../services/channel-service/channel.service';
import { ErrorService } from '../../../services/error-service/error.service';
import { User } from '../../../../models/user.class';
import { IMAGES } from '../../../shared/constants/image-urls';

@Component({
  selector: 'app-channel-main-chat-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './channel-main-chat-input.component.html',
  styleUrl: './channel-main-chat-input.component.scss',
})
export class ChannelMainChatInputComponent {
  //todo: create new channelThread, create new Message & getFormInput, setChannelThreadtoChannel, setMessageToChannelThread, addFirstMessageToChannelHeader

  @Output() newChannelThreadId = new EventEmitter<string>();
  @Input() activeUser: User | undefined = undefined;
  @Input() activeChannelId: string | undefined = undefined;

  chatInputForm: FormGroup;
  imagePaths = IMAGES;

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

  /**
   * Handles the form submission when a user sends a message.
   * This function orchestrates the entire process:
   * 1. Validates the form.
   * 2. Creates a new channel thread.
   * 3. Creates a new message.
   * 4. Saves the message to the thread.
   * 5. Saves the first message to the thread's `firstMessage` array.
   * 6. Emits the new thread ID to the parent component.
   * 7. Resets the form after successful submission.
   * @returns {Promise<void>} - A promise that resolves when the submission process is complete.
   */
  async onSubmit(): Promise<void> {
    if (!this.chatInputForm.valid) {
      console.error('Form is invalid');
      this.errorService.showErrorNotification('Please enter a valid message');
      return;
    }
    try {
      const messageData = this.getMessageData();
      const returnedChannelThreadId = await this.createChannelThread();
      const newMessage = this.createMessage(
        returnedChannelThreadId,
        messageData
      );

      await this.saveMessageToThread(returnedChannelThreadId, newMessage);
      await this.saveFirstMessageToThread(returnedChannelThreadId, newMessage);

      this.handleSuccess(returnedChannelThreadId);
    } catch (error) {
      this.handleSubmissionError(error);
    }
  }

  /**
   * Checks if the chat input form is valid.
   * @returns {boolean} - `true` if the form is valid, `false` otherwise.
   */
  private isFormValid(): boolean {
    return this.chatInputForm.valid;
  }

  /**
   * Handles errors when the form is invalid.
   * Logs an error message and shows a user-friendly notification.
   */
  private handleFormError(): void {
    console.error('Form is invalid');
    this.errorService.showErrorNotification('Please enter a valid message');
  }

  /**
   * Retrieves the message data from the form.
   * @returns {string} - The message text entered by the user.
   */
  private getMessageData(): string {
    return this.chatInputForm.get('message')?.value;
  }

  /**
   * Creates a new message using the `messageService`.
   * @param {string} threadId - The ID of the thread to which the message belongs.
   * @param {string} messageData - The text content of the message.
   * @returns {Message} - The newly created `Message` object.
   */
  private createMessage(threadId: string, messageData: string): Message {
    if (!this.activeUser) {
      throw new Error("Active User is required.");
    }
    let user = this.activeUser.toJson()

    console.log("create message user", user)
    return this.messageService.createMessage(
      threadId,
      messageData,
      user
    );
  }

  /**
   * Creates a new channel thread using the `channelService`.
   * @returns {Promise<string>} - A promise that resolves with the ID of the newly created thread.
   */
  private async createChannelThread(): Promise<string> {
    if (!this.activeChannelId || !this.activeUser) {
      throw new Error("Active Channel Id and User is required.");
    }
    return this.channelService.createChannelThread(
      this.activeChannelId,
      this.activeUser
    );
  }

  /**
   * Saves the message to the thread's subcollection in the database.
   * @param {string} threadId - The ID of the thread.
   * @param {Message} message - The message to be saved.
   * @returns {Promise<void>} - A promise that resolves when the message is successfully saved.
   */
  private async saveMessageToThread(
    threadId: string,
    message: Message
  ): Promise<void> {
    if (!this.activeChannelId) {
      throw new Error("Active Channel Id is required.");
    }
    await this.messagingService.setMessagetoChannelThread(
      this.activeChannelId,
      threadId,
      message
    );
  }

  /**
   * Saves the first message to the thread's `firstMessage` array.
   * @param {string} threadId - The ID of the thread.
   * @param {Message} message - The message to be saved as the first message.
   * @returns {Promise<void>} - A promise that resolves when the message is successfully saved.
   */
  private async saveFirstMessageToThread(
    threadId: string,
    message: Message
  ): Promise<void> {
    if (!this.activeChannelId) {
      throw new Error("Active Channel Id is required.");
    }
    await this.messagingService.setMessageToChannelThreadFirstMessage(
      this.activeChannelId,
      threadId,
      message
    );
  }

  /**
   * Handles the success scenario after a message is successfully submitted.
   * Emits the new thread ID to the parent component and resets the form.
   * @param {string} threadId - The ID of the newly created thread.
   */
  private handleSuccess(threadId: string): void {
    this.newChannelThreadId.emit(threadId);
  }

  /**
   * Handles errors that occur during the submission process.
   * Logs the error and shows a user-friendly notification.
   * @param {any} error - The error object caught during submission.
   */
  private handleSubmissionError(error: any): void {
    console.error('Message submission error:', error);
    this.errorService.showErrorNotification(
      'Failed to send message. Please try again.'
    );
  }
}
