import { Routes, RouterModule } from '@angular/router';
import { DirectMessageComponent } from './components/direct-message/direct-message.component';
import { DirectMessageListComponent } from './components/direct-message-list/direct-message-list.component';

export const routes: Routes = [

  {
    path: 'chat/:id',
    component: DirectMessageComponent
  }

];
