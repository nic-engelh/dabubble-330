import { DataService } from './../../services/data-service/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageInputComponent } from '../message-input/message-input.component';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from '../../services/message-service/message.service';
import { MessagingService } from '../../services/messaging-service/messaging.service';
import { Subscription } from 'rxjs';
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
  messages: Message[] = [];
  conversationId = '30040944-9e8d-4d01-a84b-a03c70ea58c7';
  messageSubscription!: Subscription;
  constructor(
    private messageService: MessageService,
    private messagingService: MessagingService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.listenForMessages();
  }

  listenForMessages() {
    this.messageSubscription = this.dataService
      .getSubcollectionUpdates('conversations', this.conversationId, 'messages')
      .subscribe({
        next: (messages: Message[]) => {
          console.log('Empfangene Nachrichten:', messages);
          this.messages = messages;
        },
        error: (error: any) => {
          console.error('Fehler beim Empfangen der Nachrichten:', error);
        },
      });
  }
  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe(); // Abonnement bei Zerstörung der Komponente aufheben
    }
  }
}
