import { Conversation } from './../../../models/conversation.class';
import { DataService } from './../data-service/data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  private channelUpdates$: Observable<any>;


  constructor(private dataService: DataService) {
    this.channelUpdates$ = this.dataService.getCollectionUpdates('channels');
  }

  getAllChannelUpdates(): Observable<any> {
    return this.channelUpdates$;
  }

   // todo: saveChannel(), getChannel(), updateChannel(), deleteChannel()

}
