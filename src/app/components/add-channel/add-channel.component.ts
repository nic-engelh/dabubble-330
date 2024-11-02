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
  @ViewChild('dialog') addMemberDialog!: AddMemberComponent;

  addChannelForm!: FormGroup;
  textContent: string = '';
  currentUser!: User;
  newChannelId!: any;
  addMemberDialogVisible: boolean = false;

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

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser);
    });
  }

  async onSubmit() {
    if (this.addChannelForm.valid && this.authService.userIsLoggedIn()) {
      const channelName = this.addChannelForm.get('channelName')?.value;
      const channelDescription = this.addChannelForm.get('description')?.value;
      this.newChannelId = await this.channelService.createChannel(
        this.currentUser,
        channelDescription,
        channelName
      );
      console.log("after resolve:",this.newChannelId);
      this.openAddMemberDialog();

      // todo update members within add-members dialog
      // todo add user feedback if channel is created after members are added

    } else {
      this.errorService.showErrorNotification('Form is invalid');
    }
  }

  calculateRows(): number {
    const lineHeight = 25; // Adjust this value based on your font size and line height
    const minRows = 1;
    const maxRows = 100;

    const lines = this.textContent.split('\n').length;
    return Math.min(Math.max(lines, minRows), maxRows);
  }

  //todo close dialog -> toggle
  closeAddChannelDialog() {
    // todo navigate link if its a new route
    // todo or: close / destory / hide delement
    return false
  }

  openAddMemberDialog() {
    this.addMemberDialog.open();
    console.log("openDialog:",this.newChannelId);
  }

  closeAddMemberDialog() {
    this.addMemberDialog.close();
  }

  get email() {
    return this.addChannelForm.get('channelName');
  }
  get password() {
    return this.addChannelForm.get('description');
  }
}
