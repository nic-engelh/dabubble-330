import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ProfilEditComponent } from '../profil-edit/profil-edit.component';
import { ProfilComponent } from '../profil/profil.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { SearchMemberComponent } from '../search-member/search-member.component';
import { User } from '../../../models/user.class';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../services/channel-service/channel.service';
import { ErrorService } from '../../services/error-service/error.service';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [RouterModule, ProfilEditComponent, ProfilComponent, SearchMemberComponent, CommonModule, FormsModule],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss',
  animations: [
    trigger('slideMenu', [
      state(
        'hidden',
        style({
          transform: 'translateY(430px)',
        })
      ),
      state(
        'visible',
        style({
          transform: 'translateY(0)',
        })
      ),
      transition('hidden <=> visible', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class AddMemberComponent {

  @ViewChild('dialog') dialog!: ElementRef;
  @Input() channelId: string | null = null;
  @Output() closeParentEvent = new EventEmitter<void>();

  addMemberVisible: boolean = false;
  addChannelVisible: boolean = false;
  searchInputVisible: boolean = false;
  selectedMembers: User[] = [];

  constructor(private channelService : ChannelService, private errorService: ErrorService) { }

  toggleMenu() {
    setTimeout(() => {
      this.addMemberVisible = !this.addMemberVisible;
    }, 50);
  }

  open(): void {
    setTimeout(() => {
      this.addMemberVisible = true;
    }, 50);
    console.log("After opening dialog:", this.channelId)
  }

  close(): void {
    this.addMemberVisible = false;
    this.closeParent();
    //todo close addChannel as well --> create different button / function
    //todo delete channel
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog.nativeElement.parentNode) {
      this.close();
    }
  }

  onMembersChange(members: User[]) {
    this.selectedMembers = members;
  }

  clearMemberSelection() {
    this.selectedMembers = [];
  }

  openSearchField() {
    this.searchInputVisible = true;
    console.log("After opening dialog:", this.channelId)
  }

  closeSearchField() {
    this.searchInputVisible = false;
    this.channelId = "";
  }

  async onSubmit() {
    // todo use channel-service to add all member [] elements to the firestore channel entry member selection.
    // todo close add-member and add-channel, give user feedback
    const newMember = this.selectedMembers;

    newMember.forEach(element => {
      this.channelService.addMemberToChannel(this.channelId!, element)
    });
    this.closeSearchField();
    this.close();
    this.errorService.showSuccessNotification('Channel erstellt.')
  }

  closeParent() {
    this.closeParentEvent.emit();  // Emit the event to the parent
  }

}
