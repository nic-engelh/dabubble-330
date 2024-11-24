import { Injectable } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { Message } from '../../../models/message.class';
import { MessageService } from '../message-service/message.service';
import { Observable, map } from 'rxjs';
import { User } from '../../../models/user.class';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  constructor(
    private dataService: DataService,
    messageService: MessageService
  ) {}

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

  //This function sends a message to a conversation. It might call MessageService to create the message, and then update the conversation accordingly.
  async sendMessage(
    conversationId: string,
    messageText: string
  ): Promise<Message> {
    // returns a promise from type Message
    return new Message();
  }

  //This function retrieves messages for a conversation. It might call MessageService to get the messages, and then return them in a format suitable for the presentation layer.
  getConversationMessages(conversationId: string): Observable<Message[]> {
    return this.dataService.getSubcollectionUpdates(
      'threads',
      conversationId,
      'conversationMessages'
    );
  }
}

// This Service is used get full conversation in the subcollection!!
