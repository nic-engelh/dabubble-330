import { Component, Input, ViewChild } from '@angular/core';
import { AddMemberComponent } from '../add-member/add-member.component';
import { Channel } from '../../../models/channel.class';
import { User } from '../../../models/user.class';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [AddMemberComponent, CommonModule, RouterModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent {

  memberListIsOpen: boolean = true;
  selectedChannel: any;
  @Input() selectedChannelId: string | null = 'aeae16e2-afdb-4e14-a7c0-3255f8744000';

  @ViewChild('dialog') addMemberDialog!: AddMemberComponent;


  constructor () { }

  openAddMemberDialog() {
    throw new Error('Method not implemented.');
  }

  close() { 
    throw new Error('Method not implemented.');
  }

}
