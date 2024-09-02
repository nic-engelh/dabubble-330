import { ChannelService } from './../../services/channel-service/channel.service';
import { Channel } from '../../../models/channel.class';
import { Conversation } from './../../../models/conversation.class';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../models/user.class';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.scss'
})
export class ChannelListComponent implements OnInit, OnDestroy {

  isOpen: boolean = true;
  channels: any[] = [];

  channelList: Channel[] =  [];
  private subscription = new Subscription;

  constructor(private channelService: ChannelService) {}


  getAllChannels() {
    return this.channelService.getAllChannelUpdates().subscribe({
      next: (data) => {
        this.channels = data;
        console.log(this.channels);
        // * Testing - put testUser/testChats into primary cache array
        this.channelList = this.channels;
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

  // Toggle the list open/close state
  toggleList() {
    this.isOpen = !this.isOpen;
  }

  ngOnInit(): void {
    this.subscription = this.getAllChannels();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
