import { ConversationService } from './../../services/conversation-service/conversation.service';
import { Component } from '@angular/core';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { DirectMessageComponent } from '../direct-message/direct-message.component';
import { ChannelComponent } from '../channel/channel.component';
import { Subscription } from 'rxjs';

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
  chatSubscription: Subscription | undefined;
  isMobile: boolean = true;

  constructor(private conversationService: ConversationService) {}

  ngOnInit(): void {
    this.chatSubscription = this.conversationService.chatId$.subscribe((chatId) => {
      this.chatId = chatId;
    });
  }

  ngOnDestroy(): void {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }
}
