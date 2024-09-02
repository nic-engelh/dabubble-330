import { Injectable } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { Message } from '../../../models/message.class';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private dataService: DataService) {}

  // This function creates a new message in the database. It might call DataService to perform the actual database operation.
  async createMessage(
    inputValues: any,
    conversationId: string,
    messageText: string
  ): Promise<Message> {
    // new Message()

    // newMessage.user = inputVal.user
    // content ....

    return new Message(); // newMessage
  }

  createMessageExample(conversationId: string, messageText: string) {
    return Message; // Promise<Message>
  }
  //This function creates a new message in the database. It might call DataService to perform the actual database operation.

  //This function retrieves messages for a conversation from the database. It might call DataService to perform the actual database operation.
  async getMessagesForConversation(conversationId: string) {
    return new Message(); //Promise<Message[]
  }

  //This function deletes a message from the database. It might call DataService to perform the actual database operation.
  async deleteMessage(messageId: string): Promise<void> {
    // return; // Promise<void>
  }
}
