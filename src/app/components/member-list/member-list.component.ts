import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AddMemberComponent } from '../add-member/add-member.component';
import { Channel } from '../../../models/channel.class';
import { User } from '../../../models/user.class';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { ChannelService } from '../../services/channel-service/channel.service';
import { Subscription } from 'rxjs';
import { DocumentData } from '@angular/fire/firestore';
import { ErrorService } from '../../services/error-service/error.service';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [AddMemberComponent, CommonModule, RouterModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit, OnDestroy {

  memberListIsOpen: boolean = false;
  currentUser: User | undefined;
  selectedChannelData?: Channel;
  private subscription!: Subscription;
  channelData: DocumentData | undefined;


  @Input() selectedChannelId: string | null = 'cb44bfd8-b1e4-485e-9b3e-51a36db57566';
  @ViewChild('dialog') addMemberDialog!: AddMemberComponent;


  constructor(
    private authService: AuthenticationService,
    private channelService: ChannelService,
    private errorService: ErrorService,
  ) { }


  /**
  * Initializes the component.
  * Retrieves the current user and the selected channel's real-time data.
  */
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser);
    });

    if (!this.selectedChannelId) {
      console.warn('No channel ID selected.');
      return;
    }

    this.subscription = this.channelService
      .getChannelRealTimeUpdates(this.selectedChannelId!)
      .subscribe({
        next: (data: any) => {
          this.selectedChannelData = data;
          console.log(this.selectedChannelData);
        },
        error: (error: any) => {
          console.error('Error retrieving real-time data:', error);
          this.errorService.showErrorNotification('Failed to retrieve channel updates. Please try again later.')
        },
      });
  }

  /**
   * Opens the add member dialog.
   */
  openAddMemberDialog() {
    this.addMemberDialog.open();
    this.addMemberDialog.searchInputVisible = true;
    this.addMemberDialog.updateSubmitButtonText("Hinzufügen");
  }

  close() {
    throw new Error('Method not implemented.');
  }

  /**
   * Destroys the component.
   * Unsubscribes from the real-time data subscription.
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
