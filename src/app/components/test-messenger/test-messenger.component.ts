import { Component } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.class';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-test-messenger',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-messenger.component.html',
  styleUrl: './test-messenger.component.scss'
})
export class TestMessengerComponent implements OnInit, OnDestroy {
  user = new User();
  userSub: Subscription = new Subscription();
  data: any;

  constructor(private dataService: DataService) {
    this.user.username = 'Craven';
  }

  async saveData() {
    const data = this.user.toJson();
    await this.dataService.setDocument('users', `${this.user.id}`, data);
  }

  async getData() {
    try {
      const data = await this.dataService.getDocument('users', `${this.user.id}`);
      console.log(data);
      this.data = data
    } catch (error) {
      console.error('Error retrieving document:', error);
    }
  }

  ngOnInit(): void {
    this.userSub.add(this.dataService.getCollectionRealTime('users')
    .subscribe({
      next: (userData) => console.log(userData),
      error: (error) => console.error(error),
      complete: () => console.log('complete')
    }));

  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }


}
