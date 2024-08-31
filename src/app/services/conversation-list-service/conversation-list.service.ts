import { Conversation } from './../../../models/conversation.class';
import { Injectable } from '@angular/core';
import { DataService } from '../data-service/data.service';
import { Observable, Subscriber, Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConversationListService {
  private conversationUpdates$: Observable<any>;

  constructor(private dataService: DataService) {
    this.conversationUpdates$ = this.dataService.getCollectionUpdates('threads');
   }

   getAllConversationUpdates(): Observable<any> {
    return this.conversationUpdates$;
  }

}
