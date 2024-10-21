import { Conversation } from './../../../models/conversation.class';
import { DataService } from './../data-service/data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Channel } from '../../../models/channel.class';
import { User } from '../../../models/user.class';
import { ErrorService } from '../error-service/error.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  private channelUpdates$: Observable<any>;


  constructor(private dataService: DataService, private error: ErrorService) {
    this.channelUpdates$ = this.dataService.getCollectionUpdates('channels');
  }

  getAllChannelUpdates(): Observable<any> {
    return this.channelUpdates$;
  }

   // todo: saveChannel(), getChannel(), updateChannel(), deleteChannel()

   //! not for deep and nested subcollection use
   async createChannel(creator: User, description: string, channelName: string) {
    const newChannel = new Channel();
    newChannel.createdBy.push(creator);
    newChannel.description = description;
    newChannel.name = channelName;
    const data = newChannel.toJson();
    try {
      //todo update for subcollection use!
      const response =  await this.dataService.setDocument('channels',`${newChannel.id}`, data);
      return response
    }
    catch (error){
      this.error.handleError(error)
      console.error('Channel creation failed');
    }
  }



}
