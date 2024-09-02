import { Component } from '@angular/core';
import { DirectMessageListComponent } from '../direct-message-list/direct-message-list.component';
import { ChannelListComponent } from '../channel-list/channel-list.component';


@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [DirectMessageListComponent, ChannelListComponent],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {

}
