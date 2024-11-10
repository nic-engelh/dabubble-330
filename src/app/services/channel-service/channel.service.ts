import { DocumentData, Firestore } from '@angular/fire/firestore';
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
      await this.dataService.setDocument('channels', `${newChannel.id}`, data);
    }
    catch (error) {
      this.error.handleError(error);
      return false
    }
    return newChannel.id
  }

  async addMemberToChannel(channelId: string, member: User): Promise<any> {
    try {
      return await this.dataService.updateArrayInCollection(channelId, 'channels', 'members', member);
    } catch (error: any) {
      this.error.showErrorNotification('Some error has orrcured! Try again')
      console.error(error);
    }
  }

  async getChannel(channelId: string) {
    try {
      return await this.dataService.getDocument('channels', channelId);
    } catch {
      this.error.showErrorNotification('Channel could be found.')
    }
  }

  async changeChannelName(newName: object, channelId: string) {
    try {
      return await this.dataService.updateDocument("channels", channelId, newName);

    } catch (error) {
      this.error.showErrorNotification('Channel name could not be changed.');
      console.error(error)
    }
  }

  async changeChannelDescription(newDescription: object, channelId: string) {
    try {
      return await this.dataService.updateDocument("channels", channelId, newDescription);

    } catch (error) {
      this.error.showErrorNotification('Channel descprition could not be changed.');
      console.error(error)
    }
  }

  getChannelRealTimeUpdates(channelId: string): Observable<DocumentData | undefined> {
    // Retrieve the observable from the FirestoreService
    return this.dataService.getDocumentRealTimeUpdates('channels', channelId);
  }
}
