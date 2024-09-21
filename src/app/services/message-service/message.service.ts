import { Injectable } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { Message } from '../../../models/message.class';
import { User } from '../../../models/user.class';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private dataService: DataService) {}

  // This function creates a new message in the database. It might call DataService to perform the actual database operation.
  createMessage(
    conversationId: string,
    messageText: string,
    sender: User
  ): Message {
    let message = new Message();
    message.content = messageText;
    message.sender = sender;
    console.log('Message', message);
    //
    // newMessage.user = inputVal.user
    // content ....

    return message; // newMessage
  }

  createMessageExample(conversationId: string, messageText: string) {
    return Message; // Promise<Message>
  }
  //This function creates a new message in the database. It might call DataService to perform the actual database operation.

  //This function retrieves messages for a conversation from the database. It might call DataService to perform the actual database operation.
  getMessagesForConversation(conversationId: string): Observable<Message[]> {
    return this.dataService.getSubcollectionUpdates(
      'threads',
      conversationId,
      'conversationMessages'
    );
  }

  // Neu: Nachricht aktualisieren
  updateMessage(message: Message, conversationId: string): Promise<void> {
    return this.dataService.updateDocumentInSubcollection(
      'threads',
      conversationId, // conversationId wird separat übergeben
      'conversationMessages',
      message.id,
      message.toJson() // speichere die Änderungen
    );
  }

  // Neu: Reaktion hinzufügen
  addReaction(
    conversationId: string,
    messageId: string,
    reaction: string
  ): Promise<void> {
    return this.dataService.updateDocumentInSubcollection(
      'threads',
      conversationId,
      'conversationMessages',
      messageId,
      { reactions: reaction }
    );
  }

  // Nachricht löschen
  deleteMessage(messageId: string, conversationId: string): Promise<void> {
    return this.dataService.deleteDocumentFromSubcollection(
      'threads',
      conversationId,
      'conversationMessages',
      messageId
    );
  }

  async updateMessagesConversation() {}

  //This function deletes a message from the database. It might call DataService to perform the actual database operation.
}
// this service does everything about the message
// for example CRUD Message to every Message!!!
