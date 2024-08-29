import { Injectable } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { Message } from '../../../models/message.class';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor() {}


  // This function creates a new message in the database. It might call DataService to perform the actual database operation.
  createMessage(inputValues: any) {
    // new Message()

    // newMessage.user = inputVal.user
    // content ....


    return  // newMessage
   }


   createMessageExample(conversationId: string, messageText: string) {
    return Message // Promise<Message>
   }
   //This function creates a new message in the database. It might call DataService to perform the actual database operation.


   //This function retrieves messages for a conversation from the database. It might call DataService to perform the actual database operation.
   getMessagesForConversation(conversationId: string) {
    return Message //Promise<Message[]
   }

      //This function deletes a message from the database. It might call DataService to perform the actual database operation.
   deleteMessage(messageId: string) {
    return // Promise<void>
   }

}
