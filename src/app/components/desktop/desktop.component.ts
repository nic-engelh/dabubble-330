import { ConversationService } from './../../services/conversation-service/conversation.service';
import { Component } from '@angular/core';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { DirectMessageComponent } from '../direct-message/direct-message.component';
import { ChannelComponent } from "../channel/channel.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [
    MainMenuComponent,
    DirectMessageComponent,
    ChannelComponent
],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.scss',
})
export class DesktopComponent {

  threadIsVisible: boolean = false;
  channelIsVisible: boolean = false;
  chatId: string | null = null;
  subscription: Subscription | undefined;

  constructor(private conversationService: ConversationService) { }

  ngOnInit(): void {
    this.subscription = this.conversationService.chatId$.subscribe((chatId) => {
      this.chatId = chatId;
    });
  }

  ngOnDestroy(): void {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }




}
