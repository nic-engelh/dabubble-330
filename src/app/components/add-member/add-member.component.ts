import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SearchMemberComponent } from '../search-member/search-member.component';
import { User } from '../../../models/user.class';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../services/channel-service/channel.service';
import { ErrorService } from '../../services/error-service/error.service';
import { MemberService } from '../../services/member-service/member.service';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [RouterModule, SearchMemberComponent, CommonModule, FormsModule],
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
  @ViewChild('submitButton') buttonRef!: ElementRef;
  @Input() channelId: string | null = null;
  @Input() optionsVisible: boolean = true;
  @Output() closeParentEvent = new EventEmitter<void>();

  addMemberVisible: boolean = false;
  addChannelVisible: boolean = false;
  searchInputVisible: boolean = false;
  selectedMembers: User[] = [];
  submitButtonText: string = 'Erstellen';


  constructor(private channelService: ChannelService, private errorService: ErrorService, private memberService: MemberService) { }

  toggleMenu() {
    setTimeout(() => {
      this.addMemberVisible = !this.addMemberVisible;
    }, 50);
  }

  updateSubmitButtonText(newText: string) {
    this.submitButtonText = newText;
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

  async addAllMembersToChannel() {
    const newMembers = await this.memberService.getAllMembers();
    if (newMembers !== null) {
      newMembers.forEach((member: User) => {
        this.channelService.addMemberToChannel(this.channelId!, member)
      });
    }
  }

  onSubmit() {
    const newMembers = this.selectedMembers;
    newMembers.forEach(member => {
      this.channelService.addMemberToChannel(this.channelId!, member)
    });
    this.closeSearchField();
    this.close();
    this.errorService.showSuccessNotification('Channel erstellt.')
  }

  closeParent() {
    this.closeParentEvent.emit();  // Emit the event to the parent
  }

}
