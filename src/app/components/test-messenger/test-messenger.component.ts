import { Component } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.class';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { Conversation } from '../../../models/conversation.class';
import { Channel } from '../../../models/channel.class';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-test-messenger',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './test-messenger.component.html',
  styleUrl: './test-messenger.component.scss',
})
export class TestMessengerComponent implements OnInit, OnDestroy {
  user = new User();
  userSub: Subscription = new Subscription();
  data: any;
  thread = new Conversation();
  channel = new Channel();
  threadMessageSub: Subscription = new Subscription();
  conversationSub: Subscription = new Subscription();


  constructor(private dataService: DataService) {
    this.user.username = 'Spiderman';
    this.thread.name = 'Deeptalk';
    this.channel.name = 'Justice League'
  }

  ngOnInit(): void {
    this.getAllUserUpdates();
    this.getAllConversationUpdates();
    this.getConversationMessageUpdates();
  }

  async saveUser() {
    const data = this.user.toJson();
    await this.dataService.setDocument('users', `${this.user.id}`, data);
  }

  async saveChannel() {
    this.channel.createdBy.push(this.user);
    this.channel.conversations.push(this.thread);
    this.channel.member.push(this.user);
    const data = this.channel.toJson();
    await this.dataService.setDocument('channels',`${this.channel.id}`, data);
  }

  async getUser() {
    try {
      const data = await this.dataService.getDocument(
        'users',
        `${this.user.id}`
      );
      console.log(data);
      this.data = data;
    } catch (error) {
      console.error('Error retrieving document:', error);
    }
  }

  async saveThread() {
    const data = this.thread.toJson();
    await this.dataService.setDocument('threads', `${this.thread.id}`, data);
  }

  async getThread() {
    try {
      const data = await this.dataService.getDocument(
        'threads',
        `${this.thread.id}`
      );
      console.log(data);
      this.data = data;
    } catch (error) {
      console.error('Error retrieving document:', error);
    }
  }

  async setUsertoThread() {
    const threadId= "852b5738-7ed3-4878-accb-e330ad9108ca";
    const userId = this.user.id;
    const userData = this.user.toJson();
    const threadData = this.thread.toJson();
   await this.dataService.addDocumentToSubcollection('threads', threadId, 'chatUsers', userData);
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

  getConversationMessageUpdates(){
    this.threadMessageSub.add (
      this.dataService.getSubcollectionUpdates('threads', '30040944-9e8d-4d01-a84b-a03c70ea58c7', 'conversationMessages').subscribe({
        next: (userData) => console.log(userData),
        error: (error) => console.error(error),
        complete: () => console.log ('complete'),
      })
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.threadMessageSub.unsubscribe();
    this.conversationSub.unsubscribe();
  }
}
