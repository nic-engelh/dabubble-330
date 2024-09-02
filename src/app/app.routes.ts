import { Routes, RouterModule } from '@angular/router';
import { DirectMessageComponent } from './components/direct-message/direct-message.component';
import { DirectMessageListComponent } from './components/direct-message-list/direct-message-list.component';
import { InConstructionComponent } from './components/in-construction/in-construction.component';
import { DesktopComponent } from './components/desktop/desktop.component';
import { ErrorComponent } from './components/error/error.component';
import { ChannelComponent } from './components/channel/channel.component';
import { TestMessengerComponent } from './components/test-messenger/test-messenger.component';


export const routes: Routes = [

  {
    path: 'chat/:id',
    component: DirectMessageComponent
  },
  {
    path: 'channel/:id',
    component: ChannelComponent
  },
  {
    path: 'construction',
    component: InConstructionComponent
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  {
    path: '',
    component: DesktopComponent
  },
  {
    path: 'testing',
    component: TestMessengerComponent
  },

];
