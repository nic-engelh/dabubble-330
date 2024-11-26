import { ConversationService } from './../../services/conversation-service/conversation.service';
import { Component } from '@angular/core';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { DirectMessageComponent } from '../direct-message/direct-message.component';
import { ChannelComponent } from '../channel/channel.component';
import { Subscription } from 'rxjs';
import { ChannelService } from '../../services/channel-service/channel.service';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [MainMenuComponent, DirectMessageComponent, ChannelComponent],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.scss',
})
export class DesktopComponent {
  threadIsVisible: boolean = false;
  channelIsVisible: boolean = false;
  chatId: string | null = null;
  channelId: string | null = null;
  chatSubscription: Subscription | undefined;
  channelSubscription: Subscription | undefined;
  isMobile: boolean = true;

  constructor(private conversationService: ConversationService, private channelService: ChannelService) { }

  ngOnInit(): void {
    this.chatSubscription = this.conversationService.chatId$.subscribe((updatedChatId) => {
      this.chatId = updatedChatId;
    });
    this.channelSubscription = this.conversationService.chatId$.subscribe((updatedChannelId) => {
      this.channelId = updatedChannelId;
    });

  }

  ngOnDestroy(): void {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
    if (this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }
  }
}
