import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { ChannelService } from '../../services/channel-service/channel.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-channel-main-chat',
  standalone: true,
  imports: [],
  templateUrl: './channel-main-chat.component.html',
  styleUrl: './channel-main-chat.component.scss'
})
export class ChannelMainChatComponent implements OnInit, OnDestroy {
  channelThreads: any;
  currentUser: any;
  currentChannelId: any;
  private channelSubscription!: Subscription;


  /*
  TODO
  on opening:
  -get active channel (channel-service)
  -read channelThreads into variables
  -read first threads-conversationMessages and corresponding sender for each channelThread
  -render channelthreads in hmtl (logged user to right, member to the left)
  -implement emoji function and array in the message/thread class

  on using:
  -sending a new channelThread-Message, creates a new thread within the channel AND in collection "threads"
  -each message is saved collectivley within message-collection (at to comp: message-input or message-service)
  -updates messages in each collection --> messages-service
  -clicking on "antworten" opens corresponding conversation/thread as modal or so.
  -clicking on message opens up options as a modal above it
  */


  constructor(
    private channelService: ChannelService,
    private authService: AuthenticationService) { }


  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
    this.channelSubscription = this.channelService.channelId$.subscribe((channelId) => {
      this.currentChannelId = channelId;
    })
  }




  ngOnDestroy() {
    if (this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }
  }


}
