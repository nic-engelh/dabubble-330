import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Channel } from '../../../models/channel.class';
import { User } from '../../../models/user.class';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { ChannelService } from '../../services/channel-service/channel.service';
import { DocumentData } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { AddMemberComponent } from '../add-member/add-member.component';


@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, AddMemberComponent],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss',
})

export class EditChannelComponent implements OnInit, OnDestroy {
  editChannelDescription!: FormGroup;
  editChannelName!: FormGroup;

  editChannelisOpen: boolean = true;
  isInputNameActive: boolean = false;
  isInputDescriptionActive: boolean = false;
  nameContent: string = '';
  textContent: string = '';
  currentUser: User | undefined;
  selectedChannel: Channel | undefined;
  @Input() selectedChannelId: string | null = 'aeae16e2-afdb-4e14-a7c0-3255f8744000';
  channelData: DocumentData | undefined;
  private subscription!: Subscription;

  @ViewChild('dialog') addMemberDialog!: AddMemberComponent;


  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private channelService: ChannelService
  ) { }

   /**
   * Initializes the component.
   * Sets up the form groups for editing the channel name and description.
   * Retrieves the current user and the selected channel's real-time data.
   */
  ngOnInit(): void {
    this.editChannelDescription = this.fb.group({
      description: ['', [Validators.required]],
    });

    this.editChannelName = this.fb.group({
      name: ['', [Validators.required]],
    });

    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser);
    });

    this.subscription = this.channelService
      .getChannelRealTimeUpdates(this.selectedChannelId!)
      .subscribe({
        next: (data: any) => {
          this.channelData = data;
          this.selectedChannel = data;
        },
        error: (error: any) => {
          console.error('Error retrieving real-time data:', error);
        },
      });
  }

   /**
   * Handles the submission of the edit channel form.
   * Updates the channel name or description based on the form type.
   * @param form The type of form being submitted (either "editName" or "editDescription").
   */
  onSubmit(form: string) {
    if (form == "editName" && this.editChannelName.valid) {
      const name = this.editChannelName.value;
      this.channelService.changeChannelName(name, this.selectedChannelId!);

    } if (form == "editDescription" && this.editChannelDescription.valid) {
      const newDescription = this.editChannelDescription.value;
      this.channelService.changeChannelName(newDescription, this.selectedChannelId!);
    }
  }

  /**
   * Toggles the input field for editing the channel name or description.
   * @param inputField The type of input field to toggle (either "inputName" or "inputDescription").
   */
  toggleInput(inputField: string) {
    if (inputField === "inputName") {
      this.isInputNameActive = !this.isInputNameActive;
      return
    } else (
      this.isInputDescriptionActive = !this.isInputDescriptionActive
    )
  }

  /**
   * Updates the text content of the channel description.
   * @param event The event triggered by the input field.
   */
  updateContent(event: Event) {
    const input = event.target as HTMLInputElement;
    this.textContent = input.value;
  }

  /**
   * Triggers change detection for the text content.
   */
  onInput(): void {
    // Trigger change detection
    this.textContent = this.textContent; // This line is actually unnecessary since we are using ngModel
  }

  /**
   * Calculates the number of rows needed to display the channel description.
   * @returns The number of rows needed.
   */
  calculateRows(): number {
    const lineHeight = 25; // Adjust this value based on your font size and line height
    const minRows = 1;
    const maxRows = 100;
    const lines = this.textContent.split('\n').length;

    // Then handle wrapped text
    // todo adjust the chars per line by checking the actual width of the area
    const charactersPerLine = 30; // Adjust based on your textarea width
    const wrappedLines = Math.ceil(this.textContent.length / charactersPerLine);

    const totalLines = Math.max(lines, wrappedLines);
    return Math.min(Math.max(totalLines, minRows), maxRows);
  }

  /**
   * Opens the add member dialog.
   */
  openAddMemberDialog() {
    this.addMemberDialog.open();
    this.addMemberDialog.searchInputVisible = true;
    this.addMemberDialog.updateSubmitButtonText("Hinzufügen");
  }

  /**
   * Closes the add member dialog.
   */
  closeAddMemberDialog() {
    this.addMemberDialog.close();
  }

   /**
   * Closes the edit channel dialog.
   * TODO: Implement this function.
   */
  close() { }

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
