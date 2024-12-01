import { ConversationService } from './../../services/conversation-service/conversation.service';
import { DataService } from './../../services/data-service/data.service';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MessageInputComponent } from '../message-input/message-input.component';
import { CommonModule, NgFor } from '@angular/common';
import { MessageService } from '../../services/message-service/message.service';
import { MessagingService } from '../../services/messaging-service/messaging.service';
import { Observable, Subscription, map } from 'rxjs';
import { Message } from '../../../models/message.class';
import { RouterModule } from '@angular/router';
import { HeaderMessageChatComponent } from '../header-message-chat/header-message-chat.component';


@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [MessageInputComponent, CommonModule, NgFor, RouterModule, HeaderMessageChatComponent],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
})
export class DirectMessageComponent implements OnInit, OnDestroy {
  conversationId: string | null = '30040944-9e8d-4d01-a84b-a03c70ea58c7';

  private messageSubscription!: Subscription;
  private conversationSubscription!: Subscription;
  messages$: Observable<{ [date: string]: Message[] }> | null = null;

  menuVisible: boolean = false;
  hoveredMessageId: string | null = null;

  isVisible: any;
  @Input() directMessageVisible: boolean = false;

  selectedThreadId: string | null = null;
  currentUserId: string = 'Sofia Müller';

  constructor(
    private messageService: MessageService,
    private messagingService: MessagingService,
    private dataService: DataService,
    private conversationService: ConversationService
  ) { }

  ngOnInit(): void {
    this.conversationSubscription = this.conversationService.chatId$.subscribe(
      (updatedChatId) => {
        this.selectedThreadId = updatedChatId;
      }
    );

    if (this.conversationId !== null) {
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
    }
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

  onMouseEnter(messageId: string) {
    this.hoveredMessageId = messageId;
  }

  onMouseLeave() {
    this.hoveredMessageId = null;
  }

  toggleMenu(messageId: string) {
    if (this.hoveredMessageId === messageId) {
      this.menuVisible = !this.menuVisible; // Sichtbarkeit umschalten
    } else {
      this.menuVisible = true; // Menü anzeigen, wenn eine neue Nachricht ausgewählt wird
      this.hoveredMessageId = messageId; // Nachricht ID setzen
    }
  }

  closeMenu() {
    this.menuVisible = false; // Menü automatisch schließen, wenn Maus das Menü verlässt
    this.hoveredMessageId = null; // Reset der Nachricht ID
  }

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

  close() {
    this.conversationService.closeChat();
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe(); // Abonnement bei Zerstörung der Komponente aufheben
    }
    if (this.conversationSubscription) {
      this.conversationSubscription.unsubscribe();
    }
  }
}
