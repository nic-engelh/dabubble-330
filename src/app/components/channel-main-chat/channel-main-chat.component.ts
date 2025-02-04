import { Component, EventEmitter, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { ChannelService } from '../../services/channel-service/channel.service';
import { EMPTY, Subscription, switchMap, tap } from 'rxjs';
import { DocumentData } from '@angular/fire/firestore';
import { User } from '../../../models/user.class';
import { ChannelMainChatInputComponent } from './channel-main-chat-input/channel-main-chat-input.component';

/**
 * Component responsible for displaying and managing the main chat interface for channels.
 * Handles real-time updates for the currently active channel and user authentication state.
 *
 * @component
 * @implements {OnInit}, {OnDestroy}
 */
@Component({
  selector: 'app-channel-main-chat',
  standalone: true,
  imports: [ChannelMainChatInputComponent],
  templateUrl: './channel-main-chat.component.html',
  styleUrl: './channel-main-chat.component.scss',
})
export class ChannelMainChatComponent implements OnInit, OnDestroy {
  channelThreads: any;
  @Output() newUser = new EventEmitter<User>() ;
  @Output() newChannelId = new EventEmitter<string>();
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

  /*
  TODO
  on opening:
  -get active channel (channel-service)
  -read channelThreads into variables (via conversation-serivce)
  -read first threads-conversationMessages and corresponding sender for each channelThread (via conversation-service)
  -render channelthreads in hmtl (logged user to right, member to the left)
  -implement emoji function and array in the message/thread class

  on using:
  -sending a new channelThread-Message, creates a new thread within the channel AND in collection "threads" (via conversation-serivce or messaing-service)
  -each message is saved collectivley within message-collection (at to compo: message-input or message-service)
  -updates messages in each collection --> messages-service
  -clicking on "antworten" opens corresponding conversation/thread as modal or so.
  -clicking on message opens up options as a modal above it

  check: https://chat.deepseek.com/a/chat/s/114178c3-0ef9-4ced-a463-1255c3205251
  */

  /**
   * Creates an instance of ChannelMainChatComponent.
   * @param {ChannelService} channelService - Service for channel-related operations
   * @param {AuthenticationService} authService - Service for authentication operations
   */
  constructor(
    private channelService: ChannelService,
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
  }

  /**
   * Sets up subscription for authenticated user state changes.
   * @private
   */
  private initializeUserSubscription(): void {
    this.subscriptions.add(
      this.authService.getCurrentUser().subscribe((user) => {
        this.newUser.emit(user);
        this.currentUser = user;
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
          console.warn('Channel ID is null or undefined');
          return;
        }
        this.newChannelId.emit(channelId);
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


  setChildsActiveUser() { }

  setChildsActiveChannelId() { }

  /**
   * Cleans up component subscriptions to prevent memory leaks.
   * @inheritdoc
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
