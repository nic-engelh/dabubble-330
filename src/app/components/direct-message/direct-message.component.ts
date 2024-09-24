import { DataService } from './../../services/data-service/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageInputComponent } from '../message-input/message-input.component';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from '../../services/message-service/message.service';
import { MessagingService } from '../../services/messaging-service/messaging.service';
import { Observable, Subscription, map } from 'rxjs';
import { Message } from '../../../models/message.class';
import { User } from '../../../models/user.class';

@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [
    MessageInputComponent,
    DirectMessageComponent,
    CommonModule,
    NgFor,
    RouterModule,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
})
export class DirectMessageComponent implements OnInit, OnDestroy {
  conversationId = '30040944-9e8d-4d01-a84b-a03c70ea58c7';
  threadId = '30040944-9e8d-4d01-a84b-a03c70ea58c7';
  private messageSubscription!: Subscription;
  messages$: Observable<{ [date: string]: Message[] }> | null = null;
  constructor(
    private messageService: MessageService,
    private messagingService: MessagingService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.messages$ = this.dataService
      .getSubcollectionUpdates(
        'threads',
        this.conversationId,
        'conversationMessages'
      )
      .pipe(
        // Gruppiere Nachrichten nach Datum
        map((messages: Message[]) =>
          this.sortAndGroupMessagesByDayMonthYear(messages)
        )
      );
    // this.messages$ = this.dataService.getCollectionUpdates('messages');
  }

  sortByDate(a: any, b: any) {
    const dateA = new Date(a.key);
    const dateB = new Date(b.key);
    return dateA > dateB ? 1 : dateA < dateB ? -1 : 0;
  }

  // Nachrichten nach Zeit sortieren und nach Tag/Monat/Jahr gruppieren
  sortAndGroupMessagesByDayMonthYear(messages: Message[]): {
    [dayMonthYear: string]: Message[];
  } {
    // Sortiere Nachrichten nach ihrem timestamp (neuste zuerst)
    const sortedMessages = messages.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Gruppiere nach Tag/Monat/Jahr
    return sortedMessages.reduce((groupedMessages, message) => {
      const date = new Date(message.timestamp);

      // Sortierschlüssel: Jahr + Monat + Tag für korrekte Sortierung
      const sortKey = `${date.getFullYear()}-${(
        '0' +
        (date.getMonth() + 1)
      ).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;

      // Füge Nachricht zur richtigen Gruppe hinzu
      if (!groupedMessages[sortKey]) {
        groupedMessages[sortKey] = [];
      }
      groupedMessages[sortKey].push(message);

      return groupedMessages;
    }, {} as { [key: string]: Message[] });
  }

  hoveredMessageId: string | null = null;

  onMouseEnter(messageId: string) {
    this.hoveredMessageId = messageId;
  }

  onMouseLeave() {
    this.hoveredMessageId = null;
  }

  // Zeigt das Menü für die angeklickte Nachricht an
  toggleMenu(message: Message) {
    message.showMenu = !message.showMenu;
  }

  // Bearbeitungslogik
  // editMessage(message: Message, conversationId: string) {
  //   const newContent = prompt('Bearbeiten Sie die Nachricht:', message.content);
  //   if (newContent !== null && newContent.trim() !== '') {
  //     message.content = newContent;
  //     this.messageService
  //       .updateMessage(message, conversationId) // conversationId wird hier übergeben
  //       .then(() => {
  //         console.log('Nachricht erfolgreich aktualisiert');
  //       })
  //       .catch((error) => {
  //         console.error('Fehler beim Aktualisieren der Nachricht:', error);
  //       });
  //   }
  // }
  // editMessage(messageData: any, conversationId: string) {
  //   // Prüfe, ob messageData korrekt zu einer Message-Instanz konvertiert wurde
  //   const message = Message.fromData(messageData);

  //   if (!(message instanceof Message)) {
  //     console.error('message ist keine Instanz von Message');
  //     return;
  //   }

  //   const newContent = prompt('Bearbeiten Sie die Nachricht:', message.content);
  //   if (newContent !== null && newContent.trim() !== '') {
  //     message.content = newContent;

  //     this.messageService
  //       .updateMessage(message, conversationId) // conversationId wird hier übergeben
  //       .then(() => {
  //         console.log('Nachricht erfolgreich aktualisiert');
  //       })
  //       .catch((error) => {
  //         console.error('Fehler beim Aktualisieren der Nachricht:', error);
  //       });
  //   }
  // }
  // editMessage(messageData: any, conversationId: string) {
  //   // Konvertiere messageData in eine Message-Instanz und stelle sicher, dass die ID korrekt ist
  //   const message = new Message(
  //     messageData.id, // Verwende die existierende ID
  //     messageData.content,
  //     new User(
  //       messageData.sender.id,
  //       messageData.sender.name,
  //       messageData.sender.email
  //     ),
  //     new Date(messageData.timestamp),
  //     messageData.isRead,
  //     messageData.showMenu,
  //     messageData.conversationId
  //   );

  //   const newContent = prompt('Bearbeiten Sie die Nachricht:', message.content);
  //   if (newContent !== null && newContent.trim() !== '') {
  //     message.content = newContent;

  //     // Stelle sicher, dass die ID richtig übergeben wird
  //     this.messageService
  //       .updateMessage(message, conversationId)
  //       .then(() => {
  //         console.log('Nachricht erfolgreich aktualisiert');
  //       })
  //       .catch((error) => {
  //         console.error('Fehler beim Aktualisieren der Nachricht:', error);
  //       });
  //   }
  // }

  // editMessage(messageData: any, conversationId: string) {
  //   const newContent = prompt(
  //     'Bearbeiten Sie die Nachricht:',
  //     messageData.content
  //   );

  //   if (newContent !== null && newContent.trim() !== '') {
  //     // Nur den Inhalt der Nachricht aktualisieren
  //     const updatedMessage = {
  //       id: messageData.id, // Nachricht-ID beibehalten
  //       content: newContent, // Nur den Inhalt aktualisieren
  //       sender: messageData.sender, // Sender-Daten beibehalten
  //       timestamp: new Date().toISOString(), // Optional: Zeitstempel aktualisieren
  //       isRead: messageData.isRead, // Status beibehalten
  //       conversationId: messageData.conversationId || conversationId, // Konversations-ID
  //     };

  //     console.log('Editing message:', updatedMessage); // Debugging

  //     // Update die Nachricht im Service
  //     this.messageService
  //       .updateMessage(updatedMessage, conversationId)
  //       .then(() => {
  //         console.log('Nachricht erfolgreich aktualisiert');
  //       })
  //       .catch((error) => {
  //         console.error('Fehler beim Aktualisieren der Nachricht:', error);
  //       });
  //   }
  // }
  editMessage(message: Message, conversationId: string) {
    const newContent = prompt('Bearbeiten Sie die Nachricht:', message.content);
    if (newContent !== null && newContent.trim() !== '') {
      message.content = newContent;

      // Stelle sicher, dass die ID gleich bleibt
      this.messageService
        .updateMessage(message, conversationId)
        .then(() => {
          console.log('Nachricht erfolgreich aktualisiert');
        })
        .catch((error) => {
          console.error('Fehler beim Aktualisieren der Nachricht:', error);
        });
    }
  }

  // Reaktion hinzufügen
  addReaction(message: Message) {
    const reaction = prompt('Fügen Sie eine Reaktion hinzu:');
    if (reaction !== null && reaction.trim() !== '') {
      // Hier könntest du eine Reaktion zur Nachricht hinzufügen, z.B. in einer separaten Reaktionsliste
      console.log('Reaktion hinzugefügt:', reaction);
    }
  }

  deleteMessage(message: Message, conversationId: string) {
    const confirmDelete = confirm(
      'Möchten Sie diese Nachricht wirklich löschen?'
    );
    if (confirmDelete) {
      this.messageService
        .deleteMessage(message.id, conversationId) // message.id und conversationId übergeben
        .then(() => {
          console.log('Nachricht erfolgreich gelöscht');
        })
        .catch((error) => {
          console.error('Fehler beim Löschen der Nachricht:', error);
        });
    }
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe(); // Abonnement bei Zerstörung der Komponente aufheben
    }
  }
}
