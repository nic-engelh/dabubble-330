import { Component } from '@angular/core';
import { MainChatComponent } from '../main-chat/main-chat.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';


@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [MainMenuComponent],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.scss'
})
export class DesktopComponent {

}
