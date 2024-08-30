import { Conversation } from './../../../models/conversation.class';
import { ConversationListService } from './../../services/conversation-list-service/conversation-list.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../models/user.class';
import { Observable, Subscriber, Subscription } from 'rxjs';


@Component({
  selector: 'app-direct-message-list',
  standalone: true,
  imports: [],
  templateUrl: './direct-message-list.component.html',
  styleUrl: './direct-message-list.component.scss'
})
export class DirectMessageListComponent implements OnInit, OnDestroy {

  // cache array for all direct messages participants/user
  directMessageList: Conversation[] =  [];
  testThread = new Conversation();
  testUser = new User();
  isOpen: boolean = true;
  conversations: any[] = [];

  private subscription = new Subscription;


  constructor (private chatListService: ConversationListService) {
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
        console.log(this.conversations);
      },
      error: (error) => {
        console.error(error);
      }
    });
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
