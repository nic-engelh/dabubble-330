import { Injectable } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { Message } from '../../../models/message.class';
import { MessageService } from '../message-service/message.service';
import { EMPTY, Observable, map } from 'rxjs';
import { ErrorService } from '../error-service/error.service';

@Injectable({
  providedIn: 'root',
})

/**
 * Represents a service for managing messages in conversations and channel-threads.
 */
export class MessagingService {

  /**
   * Constructs a new instance of MessageManagerService.
   * @param {DataService} dataService - Service for interacting with the data layer.
   * @param {MessageService} messageService - Service for managing message-related operations.
   * @param {ErrorService} error - Service for handling and displaying errors.
   */
  constructor(
    private dataService: DataService,
    messageService: MessageService,
    private error: ErrorService
  ) { }

  /**
   * Adds a message to a conversation's subcollection in the database.
   * @param {string} threadId - The ID of the thread (conversation) to which the message belongs.
   * @param {Message} messageData - The message data to be added.
   * @returns {Promise<void>} - A promise that resolves when the message is successfully added.
   */
  async setMessagetoConversation(threadId: string, messageData: Message) {
    const messageId = messageData.id;
    const messageDataJson = messageData.toJson();
    await this.dataService.addDocumentToSubcollection(
      'threads',
      threadId,
      'conversationMessages',
      messageId,
      messageDataJson
    );
  }

  /**
   * Adds a message to a channel thread's subcollection in the database.
   * @param {string} channelId - The ID of the channel containing the thread.
   * @param {string} channelThreadId - The ID of the thread within the channel.
   * @param {Message} message - The message data to be added.
   * @returns {Promise<void>} - A promise that resolves when the message is successfully added.
   * @throws {Error} - If the message cannot be added, an error notification is shown.
   */
  async setMessagetoChannelThread(
    channelId: string,
    channelThreadId: string,
    message: Message
  ) {
    try {
      await this.dataService.addDocumentToSubSubcollection(
        'channels',
        channelId,
        'channelThreads',
        channelThreadId,
        'conversationMessages',
        message.id,
        message
      );
    } catch (error: any) {
      this.error.showErrorNotification('Message could not be set to document');
      throw (error);
    }
  }

  async setMessageToChannelThreadFirstMessage(channelId: string, channelThreadId: string, message: Message) {
    const mainDoc = `channels/${channelId}/channelThreads`;
    const arrayName = 'firstMessage'

    try {
      await this.dataService.updateArrayInCollection(channelThreadId, mainDoc, arrayName, message)
    } catch (error: any) {
      this.error.showErrorNotification('Message could not be set to documents array');
      throw (error);
    }
  }
  
  /**
   * Sends a message to a conversation.
   * This function might call `MessageService` to create the message and then update the conversation.
   * @param {string} conversationId - The ID of the conversation to which the message is sent.
   * @param {string} messageText - The text content of the message.
   * @returns {Promise<Message>} - A promise that resolves with the created `Message` object.
   */
  async sendMessage(
    conversationId: string,
    messageText: string
  ): Promise<Message> {
    // returns a promise from type Message
    return new Message();
  }

  /**
  * Retrieves messages for a conversation.
  * This function might call `MessageService` to get the messages and return them in a suitable format.
  * @param {string} conversationId - The ID of the conversation for which messages are retrieved.
  * @returns {Observable<Message[]>} - An observable that emits an array of `Message` objects.
  */
  getConversationMessages(conversationId: string): Observable<Message[]> {
    return this.dataService.getSubcollectionUpdates(
      'threads',
      conversationId,
      'conversationMessages'
    );
  }

}
