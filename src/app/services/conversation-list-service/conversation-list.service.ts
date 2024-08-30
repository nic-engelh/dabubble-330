import { Conversation } from './../../../models/conversation.class';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data-service/data.service';
import { Observable, Subscriber, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationListService {
  private conversations$: Observable<any>;

  constructor(private dataService: DataService) {
    this.conversations$ = this.dataService.getCollectionUpdates('threads');
   }

   getAllConversationUpdates(): Observable<any> {
    return this.conversations$;
  }

}
