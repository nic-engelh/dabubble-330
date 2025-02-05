import { User } from './../../../models/user.class';
import { Component } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { CommonModule } from '@angular/common';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { Conversation } from '../../../models/conversation.class';
import { Channel } from '../../../models/channel.class';
import { RouterModule } from '@angular/router';
import { Message } from '../../../models/message.class';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';

@Component({
  selector: 'app-test-messenger',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './test-messenger.component.html',
  styleUrl: './test-messenger.component.scss',
})
export class TestMessengerComponent implements OnInit, OnDestroy {
  memberId = '8hj6zIRM86tUWql0PKzJ';
  userSub: Subscription = new Subscription();
  user: User = new User();
  data: any;
  thread = new Conversation();
  channel = new Channel();
  threadMessageSub: Subscription = new Subscription();
  conversationSub: Subscription = new Subscription();
  memberData: any;
  testMessage: Message = new Message();

  currentUser: User = new User();
  fireUser: any;

  testChatId: string = '30040944-9e8d-4d01-a84b-a03c70ea58c7';

  constructor(
    private dataService: DataService,
    private authService: AuthenticationService
  ) { }

  async ngOnInit(): Promise<void> {
    this.authService.getCurrentUser().subscribe((fireAuthUser) => {
      this.fireUser = fireAuthUser;
    });
    console.log("fireUser: ", this.fireUser);
    console.log("currentUser: ", this.currentUser);


    this.getConversationMessageUpdates();
    await this.getMember();
    //await this.addParticipantsToChat();
    //await this.createMessage();
    //await this.addTestMessagetoThread();
  }

  async saveUser() {
    const data = this.user.toJson();
    await this.dataService.setDocument('users', `${this.user.id}`, data);
  }

  printCurrentUser() {
    console.log("Current User:", this.fireUser);
  }

  transfromFireUserToCurrenUser() {
    this.currentUser.username = this.fireUser.displayName || '';
    this.currentUser.email = this.fireUser.email || '';
    this.currentUser.id = this.fireUser.uiid || '';
    this.currentUser.updateTimestamp();
    this.currentUser = this.currentUser.toJson();
    console.log("after transform:", this.currentUser)
  }


  async saveChannel() {
    this.channel.createdBy.push(this.user);
    this.channel.members.push(this.user);
    const data = this.channel.toJson();
    await this.dataService.setDocument('channels', `${this.channel.id}`, data);
  }

  async getMember() {
    try {
      const data = await this.dataService.getDocument(
        'members',
        `${this.memberId}`
      );
      console.log('Member Data from Test', data);
      this.memberData = data;
    } catch (error) {
      console.error('Error retrieving document:', error);
    }
  }

  async addParticipantsToChat() {

    try {
      this.dataService.updateArrayInCollection(this.testChatId, 'threads', 'participants', this.currentUser)
    } catch (error) {
      console.error(error)

    }
    //this.dataService.updateArrayInCollection(this.testChatId, 'threads', 'participants', this.memberData)

  }

  createMessage() {
    let content: string = 'Hallo, dass ich die zweite Nachricht.';
    let sender: any = this.currentUser.toJson();
    this.testMessage.content = content;
    this.testMessage.sender = sender;
    console.log('test message content:', this.testMessage);
  }

  async saveThread() {
    const data = this.thread.toJson();
    await this.dataService.setDocument('threads', `${this.thread.id}`, data);
  }

  async getThread() {
    try {
      const data = await this.dataService.getDocument(
        'threads',
        `${this.testChatId}`
      );
      console.log('Test Chat data from Test:', data);
      this.data = data;
    } catch (error) {
      console.error('Error retrieving document:', error);
    }
  }

  async addTestMessagetoThread() {
    const threadId = this.testChatId;
    const userId = this.memberId;
    const messageData = this.testMessage.toJson();
    await this.dataService.addDocumentToSubcollection(
      'threads',
      threadId,
      'conversationMessages',
      this.testMessage.id,
      messageData
    );
  }

  async setUsertoThread() {
    const threadId = this.testChatId;
    const userId = this.memberId;
    const userData = this.user.toJson();
    const threadData = this.thread.toJson();
    await this.dataService.addDocumentToSubcollection(
      'threads',
      threadId,
      'chatUsers',
      '3333999999000',
      userData
    );
  }

  getAllUserUpdates() {
    this.userSub.add(
      this.dataService.getCollectionUpdates('users').subscribe({
        next: (userData) => console.log(userData),
        error: (error) => console.error(error),
        complete: () => console.log('complete'),
      })
    );
  }

  getAllConversationUpdates() {
    this.conversationSub.add(
      this.dataService.getCollectionUpdates('threads').subscribe({
        next: (threadData) => console.log(threadData),
        error: (error) => console.error(error),
        complete: () => console.log('complete'),
      })
    );
  }

  getConversationMessageUpdates() {
    this.threadMessageSub.add(
      this.dataService
        .getSubcollectionUpdates(
          'threads',
          '30040944-9e8d-4d01-a84b-a03c70ea58c7',
          'conversationMessages'
        )
        .subscribe({
          next: (userData) => console.log(userData),
          error: (error) => console.error(error),
          complete: () => console.log('complete'),
        })
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.threadMessageSub.unsubscribe();
    this.conversationSub.unsubscribe();
  }
}
