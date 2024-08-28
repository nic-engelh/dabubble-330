import { Injectable } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { Message } from '../../../models/message.class';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private dataService: DataService) { }

  sendMessage() {}

  async setMassagetoConversation(threadId:string, messageData: Message) {
    const messageDataJson = messageData.toJson();
   await this.dataService.addDocumentToSubcollection('threads', threadId, 'conversationMessages', messageDataJson);
  }
}


// save threat
// get threat
// update threat
