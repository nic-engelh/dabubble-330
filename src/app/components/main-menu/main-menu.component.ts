import { Component } from '@angular/core';
import { DirectMessageListComponent } from '../direct-message-list/direct-message-list.component';


@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [DirectMessageListComponent],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {

}
