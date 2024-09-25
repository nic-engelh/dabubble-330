import { Injectable } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { Message } from '../../../models/message.class';
import { User } from '../../../models/user.class';
import { Observable } from 'rxjs';
import { collection, doc, getDoc } from '@angular/fire/firestore';

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

  //   updateMessage(message: Message, conversationId: string): Promise<void> {
  //     console.log('Updating message with ID:', message.id); // ID überprüfen
  //     return this.dataService.updateDocumentInSubcollection(
  //       'threads',
  //       conversationId,
  //       'conversationMessages',
  //       message.id, // Verwende die ID der Nachricht
  //       {
  //         content: message.content,  // Übergebe nur die Felder, die du aktualisieren willst
  //         timestamp: message.timestamp.toISOString(),
  //         isRead: message.isRead
  //       }
  //     );
  // }

  // updateMessage(message: Message, conversationId: string): Promise<void> {
  //   console.log('Updating message with ID:', message.id); // Gleiche ID sicherstellen

  //   // Stelle sicher, dass message.timestamp ein Date ist
  //   const timestamp =
  //     message.timestamp instanceof Date
  //       ? message.timestamp
  //       : new Date(message.timestamp);

  //   return this.dataService.updateDocumentInSubcollection(
  //     'threads',
  //     conversationId,
  //     'conversationMessages',
  //     message.id, // Verwende die existierende ID
  //     {
  //       content: message.content, // Nur die Felder aktualisieren
  //       timestamp: timestamp.toISOString(),
  //       isRead: message.isRead,
  //     }
  //   );
  // }
  async updateMessage(message: Message, conversationId: string): Promise<void> {
    console.log('Updating message with ID:', message.id);

    const exists = await this.dataService.documentExistsInSubcollection(
      'threads',
      conversationId,
      'conversationMessages',
      message.id
    );

    if (!exists) {
      console.error(
        'Dokument existiert nicht, aktualisiere nicht:',
        message.id
      );
      return;
    }

    await this.dataService.updateDocumentInSubcollection(
      'threads',
      conversationId,
      'conversationMessages',
      message.id,
      message // Hier wird die aktuelle Nachricht aktualisiert
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
