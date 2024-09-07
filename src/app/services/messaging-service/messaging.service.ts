import { Injectable } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { Message } from '../../../models/message.class';
import { MessageService } from '../message-service/message.service';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  constructor(
    private dataService: DataService,
    messageService: MessageService
  ) {}

  async setMessagetoConversation(threadId: string, messageData: Message) {
    const messageDataJson = messageData.toJson();
    await this.dataService.addDocumentToSubcollection(
      'threads',
      threadId,
      'conversationMessages',
      messageDataJson
    );
  }

  //This function sends a message to a conversation. It might call MessageService to create the message, and then update the conversation accordingly.
  async sendMessage(
    conversationId: string,
    messageText: string
  ): Promise<Message> {
    // returns a promise from type Message
    return new Message();
  }

  //This function retrieves messages for a conversation. It might call MessageService to get the messages, and then return them in a format suitable for the presentation layer.
  getConversationMessages(conversationId: string) {
    // returns a promise from type Message
    return new Message();
  }
}
