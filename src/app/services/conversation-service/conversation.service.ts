import { Injectable } from '@angular/core';
import { DataService } from '../data-service/data.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private conversationUpdates$: Observable<any>;
  private chatIdSubject = new BehaviorSubject<string | null>(null);
  chatId$ = this.chatIdSubject.asObservable();


  constructor(private dataService: DataService) {
    this.conversationUpdates$ =
      this.dataService.getCollectionUpdates('threads');
  }

  getAllConversationUpdates(): Observable<any> {
    return this.conversationUpdates$;
  }

  openChat(chatId: string): void {
    this.chatIdSubject.next(chatId);
  }

  closeChat(): void {
    this.chatIdSubject.next(null);
  }

  getCurrentChatId(): string | null {
    return this.chatIdSubject.getValue();
  }

  // todo: saveChat(), getChat(), updateChat(), deleteChat()
}
// this service is used in the collection about chancels etc.
