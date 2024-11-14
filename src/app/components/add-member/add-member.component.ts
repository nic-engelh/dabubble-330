import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
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

  constructor(
    private channelService: ChannelService,
    private errorService: ErrorService,
    private memberService: MemberService
  ) {}

  /**
   * Toggles the visibility of the member addition menu with a slight delay
   */
  toggleMenu() {
    setTimeout(() => {
      this.addMemberVisible = !this.addMemberVisible;
    }, 50);
  }

  /**
   * Updates the text displayed on the submit button
   * @param newText - The new text to display on the submit button
   */
  updateSubmitButtonText(newText: string) {
    this.submitButtonText = newText;
  }

  /**
   * Opens the member addition dialog with a slight delay
   */
  open(): void {
    setTimeout(() => {
      this.addMemberVisible = true;
    }, 50);
    console.log('After opening dialog:', this.channelId);
  }

  /**
   * Closes the member addition dialog and triggers parent closure
   */
  close(): void {
    this.addMemberVisible = false;
    this.closeParent();
    //todo close addChannel as well --> create different button / function
    //todo delete channel
    if (this.channelId !== null) {
      this.channelService.deleteChannel(this.channelId);
    }
  }

  /**
   * Handles clicks on the dialog backdrop
   * @param event - The mouse event from clicking the backdrop
   */
  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog.nativeElement.parentNode) {
      this.close();
    }
  }

  /**
   * Updates the selected members list
   * @param members - Array of User objects representing selected members
   */
  onMembersChange(members: User[]) {
    this.selectedMembers = members;
  }

  /**
   * Clears the current member selection
   */
  clearMemberSelection() {
    this.selectedMembers = [];
  }

  /**
   * Opens the search field and logs the current channel ID
   */
  openSearchField() {
    this.searchInputVisible = true;
    console.log('After opening dialog:', this.channelId);
  }

  /**
   * Closes the search field and resets the channel ID
   */
  closeSearchField() {
    this.searchInputVisible = false;
    this.channelId = '';
  }

  /**
   * Adds all available members to the current channel
   * @returns Promise<void>
   */
  async addAllMembersToChannel() {
    const newMembers = await this.memberService.getAllMembers();
    if (newMembers !== null) {
      newMembers.forEach((member: User) => {
        this.channelService.addMemberToChannel(this.channelId!, member);
      });
    }
  }

  /**
   * Handles the submission of selected members to add to the channel
   */
  onSubmit() {
    const newMembers = this.selectedMembers;
    newMembers.forEach((member) => {
      this.channelService.addMemberToChannel(this.channelId!, member);
    });
    this.closeSearchField();
    this.close();
    this.errorService.showSuccessNotification('Channel erstellt.');
  }

  /**
   * Emits an event to close the parent component
   */
  closeParent() {
    this.closeParentEvent.emit();
  }
}
