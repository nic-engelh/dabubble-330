import { UserService } from '../../services/user-service/user.service';
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { ChannelService } from '../../services/channel-service/channel.service';
import { EMPTY, Observable, scan, Subscription, switchMap, tap } from 'rxjs';
import { DocumentData } from '@angular/fire/firestore';
import { User } from '../../../models/user.class';
import { ChannelMainChatInputComponent } from './channel-main-chat-input/channel-main-chat-input.component';
import { Conversation } from '../../../models/conversation.class';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IMAGES } from '../../shared/constants/image-urls';

/**
 * Component responsible for displaying and managing the main chat interface for channels.
 * Handles real-time updates for the currently active channel and user authentication state.
 *
 * @component
 * @implements {OnInit}, {OnDestroy}
 */

/* Explanation of this component:
  -get active channel (channel-service)
  -read channelThreads into variables (via conversation-serivce)
  -read first threads-conversationMessages and corresponding sender for each channelThread (via conversation-service)
  -render channelthreads in hmtl (logged user to right, member to the left)
  -implement emoji function and array in the message/thread class
  - IMPORTANT: FirstMessage needs to always the same Message, as in the subcollection, even after an update of the Message

  on using:
  -sending a new channelThread-Message, creates a new thread within the channel AND in collection "threads" (via conversation-serivce or messaing-service)
  -each message is saved collectivley within message-collection (at to compo: message-input or message-service)
  -updates messages in each collection --> messages-service
  -clicking on "antworten" opens corresponding conversation/thread as modal or so.
  -clicking on message opens up options as a modal above it

  check: https://chat.deepseek.com/a/chat/s/114178c3-0ef9-4ced-a463-1255c3205251
  */

  //! allChannels$ and channelThreads$ are triggering to often. They are no good solutions right now.
  //TODO delete allChannels$ update and create a new Subject newChannelThreads - separate (old) channelTheads from the new Updates.

@Component({
  selector: 'app-channel-main-chat',
  standalone: true,
  imports: [ChannelMainChatInputComponent, CommonModule, RouterModule],
  templateUrl: './channel-main-chat.component.html',
  styleUrl: './channel-main-chat.component.scss',
})
export class ChannelMainChatComponent implements OnInit, OnDestroy {
  imagePaths = IMAGES;
  channelThreads$: Observable<any[]> | undefined;
  channelData: DocumentData | undefined;
  createdChannelThreadId: string | undefined;
  currentUser: User | undefined;
  activeChannelId: string | undefined;

  /**
  * Composite subscription container for managing all component subscriptions.
  * @type {Subscription}
  * @private
  */
  private subscriptions: Subscription = new Subscription();

  activateTestChannel() {
    this.channelService.openChannel("634f8b15-b353-4bff-bc4b-ed0b1daa8031");
  }

  /**
   * Creates an instance of ChannelMainChatComponent.
   * @param {ChannelService} channelService - Service for channel-related operations
   * @param {AuthenticationService} authService - Service for authentication operations
   */
  constructor(
    private channelService: ChannelService,
    private userService: UserService,
    private authService: AuthenticationService
  ) { }

  /**
   * Initializes the component and sets up subscriptions:
   * - Authentication state subscription
   * - Channel ID changes subscription
   * - Real-time channel data updates
   * @inheritdoc
   */
  ngOnInit(): void {

    this.initializeUserSubscription();
    this.initializeChannelSubscriptions();
    this.initializeChannelThreadsUpdateSubcription();
    this.activateTestChannel();
    console.log("Channel Main User: ", this.currentUser);
    console.log("Channel Main active channel: ", this.activeChannelId);
    console.log("Channel Main Threads: ", this.channelThreads$);

    this.channelThreads$!.subscribe(threads => {
      console.log('Threads emitted:', threads);
    });
  }

  /**
   * Sets up subscription for authenticated user state changes.
   * @private
   */
  private initializeUserSubscription(): void {
    this.subscriptions.add(
      this.authService.getCurrentUser().subscribe((user) => {

        if(this.userService.isFirebaseUser(user)) {
          this.currentUser = this.userService.transformFireUsertoBubbleUser(user);
          //this.currentUser = this.currentUser.toJson();
          console.log("channel main chat bubble user", this.currentUser);
        }

        console.log("Current firebase user", user);
      })
    );
  }

  /**
   * Configures subscriptions for channel ID changes and real-time data updates.
   * Uses switchMap to ensure proper cleanup of previous channel subscriptions.
   * @private
   */
  private initializeChannelSubscriptions(): void {
    const channelUpdatesSub = this.channelService.channelId$.pipe(
      tap((channelId) => {
        if (channelId == null) {
          return;
        }
        this.activeChannelId = channelId;
      }),
      switchMap((channelId) => {
        if (!channelId) return EMPTY;
        return this.channelService.getChannelRealTimeUpdates(channelId);
      })
    ).subscribe({
      next: (data) => {
        this.channelData = data;
      },
      error: (err) => console.error('Error fetching channel updates:', err),
    });

    this.subscriptions.add(channelUpdatesSub);
  }

  receiveCreatedChannelThreadId(newThreadId: string) {
    this.createdChannelThreadId = newThreadId;
  }

  /**
   * Initializes the subscription to channel thread updates
   *
   * @private
   * @returns {void}
   * @throws {Error} if an error ocurs durcing subscription or processing
   */
  private initializeChannelThreadsUpdateSubcription(): void {
    try {
      this.channelThreads$ = this.createChannelThreadsObservable();
    } catch (error) {
      console.error("ChannelThreadSub:", error);
    }
  }

  /**
   * Creates the Observable stream for all conversation threads.
   *
   * @private
   * @return {Observable<Conversation[]>}
   */
  private createChannelThreadsObservable(): Observable<Conversation[]> {
    return this.channelService.allChannelThreads$.pipe(
      scan(this.accumulateThreads, [] as Conversation[])
    );
  }

  /**
   * Accumulates new thred arrays into a single array of all threads.
   *
   * @private
   * @param {Conversation[]} allThreads - the accumulated array of all threads.
   * @param {Conversation[]} newThreads - the new array of threads to add.
   * @returns {Conversation[]} A new array containing all threads.
   */
  private accumulateThreads(allThreads: Conversation[], newThreads: Conversation[]): Conversation[] {
    return [...newThreads];
  }

  /**
   * Cleans up component subscriptions to prevent memory leaks.
   * @inheritdoc
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
