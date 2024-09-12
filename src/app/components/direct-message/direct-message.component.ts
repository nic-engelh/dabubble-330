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
        map((messages: Message[]) => this.groupMessagesByDate(messages))
      );
    // this.messages$ = this.dataService.getCollectionUpdates('messages');
  }

  groupMessagesByDate(messages: Message[]): { [date: string]: Message[] } {
    return messages.reduce((groupedMessages, message) => {
      const date = new Date(message.timestamp).toDateString(); // Nur Datum (ohne Zeit)
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(message);
      return groupedMessages;
    }, {} as { [date: string]: Message[] });
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe(); // Abonnement bei Zerstörung der Komponente aufheben
    }
  }
}
