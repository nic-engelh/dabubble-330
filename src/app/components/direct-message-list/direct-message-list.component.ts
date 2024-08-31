import { Conversation } from './../../../models/conversation.class';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../models/user.class';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ConversationService } from '../../services/conversation-service/conversation.service';


@Component({
  selector: 'app-direct-message-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './direct-message-list.component.html',
  styleUrl: './direct-message-list.component.scss'
})
export class DirectMessageListComponent implements OnInit, OnDestroy {

  // * Testing variables
  testThread = new Conversation();
  testUser = new User();

  // ! essential variables
  isOpen: boolean = true;
  conversations: any[] = [];
  // cache array for all direct messages participants/user
  directMessageList: Conversation[] =  [];
  private subscription = new Subscription;


  constructor (private chatListService: ConversationService) {

    //* Testing variables
    this.testUser.username = "Clark Kent";
    this.testUser.avatarUrl = "/assets/img/avatar_small_male_1.svg";
    this.testThread.participants.push(this.testUser);
    this.directMessageList.push(this.testThread);
    this.testThread.participants.push(this.testUser);
    this.directMessageList.push(this.testThread);

  }

  ngOnInit(): void {
    this.subscription = this.getAllChats();
  }

  getAllChats () {
   return this.chatListService.getAllConversationUpdates().subscribe({
      next: (data) => {
        this.conversations = data;

        // *Testing - adding test user to array
        this.conversations.forEach((conversation) => {
          if (!conversation.participants.includes(this.testUser)){
            conversation.participants.push(this.testUser);
          }
        } );
        console.log(this.conversations);
        // * Testing - put testUser/testChats into primary cache array
        this.directMessageList = this.conversations;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  // todo: conversations[0] needs to automated -> finding the right chat partner
  // ? Maybe participants deleted from chat creator?
  addUserToChat() {
    try {
      this.conversations[0].push(this.testUser);
      console.log(this.conversations);
    }
    catch (e) {
      console.error(e)
    }
  }

  toggleList() {
    this.isOpen = !this.isOpen; // Toggle the list open/close state
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
