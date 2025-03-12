import { Conversation } from './../../../models/conversation.class';
import { Channel } from './../../../models/channel.class';
import {
  DocumentData,
  doc,
  updateDoc,
  increment,
  Firestore,
} from '@angular/fire/firestore';
import { DataService } from './../data-service/data.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, mergeMap, Observable, switchMap } from 'rxjs';
import { User } from '../../../models/user.class';
import { ErrorService } from '../error-service/error.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  /**
   * A Subject that emits the current channel ID or null.
   * @type {BehaviorSubjectS<string | null>}
   */
  private channelIdSubject = new BehaviorSubject<string | null>(null);

  /**
   * An observable that emits the current channel ID or null.
   * @type {Observable<string | null>}
   */
  channelId$ = this.channelIdSubject.asObservable();

  /**
   * Opens a channel by setting the channel ID.
   * @param {string} channelId - The ID of the channel to open.
   * @returns {void}
   */
  openChannel(channelId: string): void {
    this.channelIdSubject.next(channelId);
  }

  /**
   * Closes the channel by setting the channel ID to null.
   * @returns {void}
   */
  closeChannel(): void {
    this.channelIdSubject.next(null);
  }

  /**
   * Observable that holds updates for channels.
   * @private
   * @type {Observable<any>}
   */
  private channelUpdates$: Observable<any>;

  /**
   * Stream of active channel threads. Automatically switches to latest channel ID,
   * ignoring null/undefined values to prevent invalid requests.
   * @type {Observable<any>}
   */
  activeChannelThreads$: Observable<any> = this.channelId$.pipe(
    filter((channelId) => channelId != null),
    switchMap((channelId) =>
      this.dataService.getSubcollectionUpdates(
        `channels`,
        channelId,
        'channelThreads'
      )
    )
  );

  /**
   * Stream of active channel threads. Accumulates threads from all channels
   * (does not cancel previous subscriptions), ignoring null/undefined values to
   * prevent invalid requests.
   * @type {Observable<any>}
   */
  allChannelThreads$: Observable<any> = this.channelId$.pipe(
    filter((channelId) => channelId != null),
    mergeMap((channelId) =>
      this.dataService.getSubcollectionUpdates(
        `channels`,
        channelId,
        'channelThreads'
      )
    )
  );

  /**
   * Constructs the ChannelService.
   * @param {DataService} dataService - Service for handling data operations.
   * @param {ErrorService} error - Service for handling errors.
   */
  constructor(
    private dataService: DataService,
    private error: ErrorService,
    private firestore: Firestore
  ) {
    this.channelUpdates$ = this.dataService.getCollectionUpdates('channels');
  }

  /**
   * Retrieves all channel updates as an observable. No subcollections are returned.
   * @returns {Observable<any>} - Observable that emits channel updates.
   */
  getAllChannelUpdates(): Observable<any> {
    return this.channelUpdates$;
  }

  //! not for deep and nested subcollection use
  /**
   * Creates a new channel.
   * @param {User} creator - The user creating the channel.
   * @param {string} description - The description of the channel.
   * @param {string} channelName - The name of the channel.
   * @returns {Promise<string | boolean>} - The ID of the new channel or false if creation fails.
   */
  async createChannel(creator: User, description: string, channelName: string) {
    const newChannel = new Channel();
    newChannel.createdBy.push(creator);
    newChannel.description = description;
    newChannel.name = channelName;
    const data = newChannel.toJson();

    try {
      //todo update for subcollection use!
      await this.dataService.setDocument('channels', `${newChannel.id}`, data);
    } catch (error) {
      this.error.handleError(error);
      return false;
    }
    return newChannel.id;
  }

  /**
   * Adds a member to a channel.
   * @param {string} channelId - The ID of the channel.
   * @param {User} member - The user to be added as a member.
   * @returns {Promise<any>} - The result of the operation.
   */
  async addMemberToChannel(channelId: string, member: User): Promise<any> {
    try {
      return await this.dataService.updateArrayInCollection(
        channelId,
        'channels',
        'members',
        member
      );
    } catch (error: any) {
      this.error.showErrorNotification('Some error has orrcured! Try again');
      console.error(error);
    }
  }

  /**
   * Retrieves a channel by its ID.
   * @param {string} channelId - The ID of the channel.
   * @returns {Promise<any>} - The channel data.
   */
  async getChannel(channelId: string) {
    try {
      return await this.dataService.getDocument('channels', channelId);
    } catch {
      this.error.showErrorNotification('Channel could be found.');
    }
  }

  /**
   * Changes the name of a channel.
   * @param {object} newName - The new name for the channel.
   * @param {string} channelId - The ID of the channel.
   * @returns {Promise<any>} - The result of the operation.
   */
  async changeChannelName(newName: object, channelId: string) {
    try {
      return await this.dataService.updateDocument(
        'channels',
        channelId,
        newName
      );
    } catch (error) {
      this.error.showErrorNotification('Channel name could not be changed.');
      console.error(error);
    }
  }

  /**
   * Changes the description of a channel.
   * @param {object} newDescription - The new description for the channel.
   * @param {string} channelId - The ID of the channel.
   * @returns {Promise<any>} - The result of the operation.
   */
  async changeChannelDescription(newDescription: object, channelId: string) {
    try {
      return await this.dataService.updateDocument(
        'channels',
        channelId,
        newDescription
      );
    } catch (error) {
      this.error.showErrorNotification(
        'Channel description could not be changed.'
      );
      console.error(error);
    }
  }

  /**
   * Retrieves real-time updates for a channel but not from subcollections
   * @param {string} channelId - The ID of the channel.
   * @returns {Observable<DocumentData | undefined>} - Observable that emits real-time updates.
   */
  getChannelRealTimeUpdates(
    channelId: string
  ): Observable<DocumentData | undefined> {
    // Retrieve the observable from the FirestoreService
    return this.dataService.getDocumentRealTimeUpdates('channels', channelId);
  }

  /**
   * Deletes a channel by its ID.
   * @param {string} channelId - The ID of the channel.
   * @returns {Promise<any>} - The result of the operation.
   */
  async deleteChannel(channelId: string): Promise<any> {
    try {
      return await this.dataService.deleteDocument('channels', channelId);
    } catch {
      this.error.showErrorNotification('Channel could not be deleted.');
    }
  }

  async createChannelThread(
    channelId: string,
    activeUser: User
  ): Promise<string> {
    //channelThreadId is withn the Conversation.id or data.id
    const newThread = new Conversation();
    newThread.creator = activeUser;
    newThread.participants.push(activeUser);
    const data = newThread.toJson();
    console.log('New Channel Thread Data:', data);
    try {
      await this.dataService.setDocumentToSubcollection(
        'channels',
        channelId,
        'channelThreads',
        newThread.id,
        data
      );
      return newThread.id;
    } catch {
      this.error.showErrorNotification('Channel could not be created.');
      throw this.error;
    }
  }

  /**
   * Increments the 'numberOfMessages' field in a Firestore document.
   *
   * @param {string} channelId - The ID of the channel.
   * @param {string} channelThreadId - The ID of the channel thread.
   * @returns {Promise<void>} - A promise that resolves when the update is complete.
   * @throws {Error} - Throws an error if the update fails.
   */
  async incrementMessageCount(
    channelId: string,
    channelThreadId: string
  ): Promise<void> {
    await updateDoc(
      doc(
        this.firestore,
        `channels/${channelId}/channelThreads/${channelThreadId}`
      ),
      {
        numberOfMessages: increment(1),
      }
    );
  }
}
