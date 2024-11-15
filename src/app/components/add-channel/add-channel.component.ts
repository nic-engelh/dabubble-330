import { CommonModule } from '@angular/common';
import { Component, OnInit, output, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChannelService } from '../../services/channel-service/channel.service';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { User } from '../../../models/user.class';
import { ErrorService } from '../../services/error-service/error.service';
import { AddMemberComponent } from '../add-member/add-member.component';

@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, AddMemberComponent],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss',
})
export class AddChannelComponent implements OnInit {
    /**
   * Reference to the AddMemberComponent dialog.
   * @type {AddMemberComponent}
   */
  @ViewChild('dialog') addMemberDialog!: AddMemberComponent;

  /**
   * Form group for adding a new channel.
   * @type {FormGroup}
   */
  addChannelForm!: FormGroup;

  textContent: string = '';
  currentUser!: User;
  newChannelId!: any;
  addMemberDialogVisible: boolean = false;

  /**
   * Constructs the ChannelFormComponent.
   * @param {FormBuilder} form - Service for building forms.
   * @param {ChannelService} channelService - Service for handling channel operations.
   * @param {AuthenticationService} authService - Service for handling authentication.
   * @param {ErrorService} errorService - Service for handling errors.
   */
  constructor(
    private form: FormBuilder,
    private channelService: ChannelService,
    private authService: AuthenticationService,
    private errorService: ErrorService
  ) {
    this.addChannelForm = this.form.group({
      channelName: ['', Validators.required],
      description: [''],
    });
  }

   /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * @returns {void}
   */
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser);
    });
  }

   /**
   * Handles the form submission.
   * @returns {Promise<void>} - A promise that resolves when the form is submitted.
   */
  async onSubmit() {
    if (this.addChannelForm.valid && this.authService.userIsLoggedIn()) {
      const channelName = this.addChannelForm.get('channelName')?.value;
      const channelDescription = this.addChannelForm.get('description')?.value;
      this.newChannelId = await this.channelService.createChannel(
        this.currentUser,
        channelDescription,
        channelName
      );
      this.openAddMemberDialog();
    } else {
      this.errorService.showErrorNotification('Form is invalid');
    }
  }

  /**
   * Calculates the number of rows based on the text content.
   * @returns {number} - The number of rows.
   */
  calculateRows(): number {
    const lineHeight = 25; // Adjust this value based on your font size and line height
    const minRows = 1;
    const maxRows = 100;

    if (!this.textContent) return minRows;
    const lines = this.textContent.split('\n').length;
    return Math.min(Math.max(lines, minRows), maxRows);
  }

  /**
   * Closes the add channel dialog.
   * @returns {boolean} - Returns false to prevent default behavior.
   */
  closeAddChannelDialog() {
    //todo close dialog -> toggle
    // todo navigate link if its a new route
    // todo or: close / destory / hide delement
    // channel will be deleted only if user cancels the add-member-dialog
    return false
  }

  /**
   * Opens the add member dialog.
   * @returns {void}
   */
  openAddMemberDialog() {
    this.addMemberDialog.open();
    console.log("openDialog:",this.newChannelId);
  }

  /**
   * Closes the add member dialog.
   * @returns {void}
   */
  closeAddMemberDialog() {
    this.addMemberDialog.close();
  }

   /**
   * Getter for the channel name form control.
   * @returns {AbstractControl | null} - The channel name form control.
   */
  get email() {
    return this.addChannelForm.get('channelName');
  }

   /**
   * Getter for the description form control.
   * @returns {AbstractControl | null} - The description form control.
   */
  get password() {
    return this.addChannelForm.get('description');
  }
}
