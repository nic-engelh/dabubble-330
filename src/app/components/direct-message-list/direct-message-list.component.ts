import { ChannelService } from './../../services/channel-service/channel.service';
import { ConversationService } from './../../services/conversation-service/conversation.service';
import { Conversation } from './../../../models/conversation.class';
import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { User } from '../../../models/user.class';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-direct-message-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './direct-message-list.component.html',
  styleUrl: './direct-message-list.component.scss',
})
export class DirectMessageListComponent implements OnInit, OnDestroy {
  // * Testing variables
  testThread = new Conversation();
  testUser = new User();

  // ! essential variables
  isOpen: boolean = true;
  conversations: any[] = [];
  // cache array for all direct messages participants/user
  directMessageList: Conversation[] = [];
  private subscription = new Subscription();

  @Output() selectedChatId: string = '';
  @Output() selectedChannelId: string = '';
  @Output() selectedChatIsVisible: boolean = false;

  /**
   * Constructor for the DirectMessageListComponent.
   *
   * @param {ConversationService} chatListService - Service for handling conversation-related operations.
   */
  constructor(private chatListService: ConversationService, private channelService: ChannelService) {
    //* Testing variables
    this.testUser.username = 'Clark Kent';
    this.testUser.avatarUrl = '/assets/img/avatar_small_male_1.svg';
    this.testThread.participants.push(this.testUser);
    this.directMessageList.push(this.testThread);
    this.testThread.participants.push(this.testUser);
    this.directMessageList.push(this.testThread);
  }

  /**
   * Angular lifecycle hook that is called after the component is initialized.
   * Subscribes to the conversation updates.
   */
  ngOnInit(): void {
    this.subscription = this.getAllChats();
  }

  /**
   * Fetches all conversations and updates the component's state.
   *
   * @returns {Subscription} - The subscription to the conversation updates.
   */
  getAllChats(): Subscription {
    return this.chatListService.getAllConversationUpdates().subscribe({
      next: (data) => {
        this.conversations = data;

        // *Testing - adding test user to array
        this.conversations.forEach((conversation) => {
          if (!conversation.participants.includes(this.testUser)) {
            conversation.participants.push(this.testUser);
          }
        });
        console.log(this.conversations);
        // * Testing - put testUser/testChats into primary cache array
        this.directMessageList = this.conversations;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  /**
   * Adds a user to the first conversation in the list.
   *
   * @todo Automate the selection of the conversation to which the user is added.
   * @todo Handle the case where participants are deleted from the chat creator.
   */
  addUserToChat(): void {
    try {
      this.conversations[0].push(this.testUser);
      console.log(this.conversations);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Toggles the visibility of the direct message list.
   */
  toggleList(): void {
    this.isOpen = !this.isOpen; // Toggle the list open/close state
  }

  /**
   * Angular lifecycle hook that is called when the component is destroyed.
   * Unsubscribes from the conversation updates to prevent memory leaks.
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Selects a conversation by setting the chat ID and opening the chat.
   * @param {string} chatId - The ID of the chat to select.
   * @returns {void}
   */
  selectConveration(chatId: string) {
    this.selectedChatId = chatId;
    this.chatListService.openChat(chatId);
    // open selected Conversation dialog
  }

  /**
   * Selects a channel by setting the channel ID and opening the channel.
   * @param {string} channelId - The ID of the channel to select.
   * @returns {void}
   */
  selectChannel(channelId: string) {
    this.selectedChannelId = channelId;
    this.channelService.openChannel(channelId)
  }

}
