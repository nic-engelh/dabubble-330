import { Conversation } from './../../../models/conversation.class';
import { ConversationListService } from './../../services/conversation-list-service/conversation-list.service';
import { Component } from '@angular/core';
import { User } from '../../../models/user.class';


@Component({
  selector: 'app-direct-message-list',
  standalone: true,
  imports: [],
  templateUrl: './direct-message-list.component.html',
  styleUrl: './direct-message-list.component.scss'
})
export class DirectMessageListComponent {

  // cache array for all direct messages participants/user
  directMessageList: Conversation[] =  [];
  testThread = new Conversation();
  testUser = new User();


  constructor (private chatListService: ConversationListService) {
    this.testUser.username = "Clark Kent"
    this.testThread.participants.push(this.testUser);
    this.directMessageList.push(this.testThread);
  }

  getDirectMessageChats() {}

}
