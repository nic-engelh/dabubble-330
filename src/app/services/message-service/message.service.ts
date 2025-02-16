import { Injectable } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { Message } from '../../../models/message.class';
import { User } from '../../../models/user.class';
import { Observable } from 'rxjs';
import { UserService } from '../user-service/user.service';


@Injectable({
  providedIn: 'root',
})
export class MessageService {

  // this service does everything about the message
  // for example CRUD Message to every Message


  constructor(private dataService: DataService, private userService: UserService) { }

  // This function creates a new message in the database. It might call DataService to perform the actual database operation.
  createMessage(
    conversationId: string,
    messageText: string,
    sender: User
  ): Message {
    let message = new Message();
    message.content = messageText;
    message.sender = sender
    console.log('Message from Message-Service', message);
    return message; // newMessage
  }



  //This function retrieves messages for a conversation from the database. It might call DataService to perform the actual database operation.
  getMessagesForConversation(conversationId: string): Observable<Message[]> {
    return this.dataService.getSubcollectionUpdates(
      'threads',
      conversationId,
      'conversationMessages'
    );
  }

  /**
 * Transforms a Firebase user object into a Bubbel user object.
 *
 * @param {any} fireUser - The Firebase user object to be transformed.
 * @returns {Object} - The transformed Bubbel user object in JSON format.
 *
 * @example
 * const fireUser = {
 *   uid: "12345",
 *   displayName: "John Doe",
 *   email: "john.doe@example.com",
 *   photoURL: "https://example.com/avatar.jpg"
 * };
 * const bubbelUser = transformFireUsertoBubbleUser(fireUser);
 * console.log(bubbelUser);
 * // Output: { id: "12345", username: "John Doe", email: "john.doe@example.com", avatarUrl: "https://example.com/avatar.jpg" }
 */
  transformFireUsertoBubbleUser(fireUser: any) {
    let newBubbelUser = new User();
    if (fireUser !== User) {
      newBubbelUser.avatarUrl = fireUser.photoURL || "";
      newBubbelUser.id = fireUser.uid || "";
      newBubbelUser.username = fireUser.displayName;
      newBubbelUser.email = fireUser.email;
      return newBubbelUser.toJson();
    } else {
      return fireUser
    }
  }

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

  async updateMessagesConversation() { }

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


  //This function deletes a message from the database. It might call DataService to perform the actual database operation.
}

