import { Injectable } from '@angular/core';
import { DataService } from '../data-service/data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private conversationUpdates$: Observable<any>;

  constructor(private dataService: DataService) {
    this.conversationUpdates$ =
      this.dataService.getCollectionUpdates('threads');
  }

  getAllConversationUpdates(): Observable<any> {
    return this.conversationUpdates$;
  }

  // todo: saveChat(), getChat(), updateChat(), deleteChat()
}
// this service is used in the collection about chancels etc.
