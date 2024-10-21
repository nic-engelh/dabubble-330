import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChannelService } from '../../services/channel-service/channel.service';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { User } from '../../../models/user.class';
import { ErrorService } from '../../services/error-service/error.service';

@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss',
})
export class AddChannelComponent implements OnInit {
  addChannelForm!: FormGroup;
  textContent: string = '';
  currentUser!: User;
  newChannelId!: any;

  constructor(
    private form: FormBuilder,
    private channelService: ChannelService,
    private authService: AuthenticationService,
    private errorSerivce: ErrorService
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

  onSubmit() {
    if (this.addChannelForm.valid && this.authService.userIsLoggedIn()) {
      const channelName = this.addChannelForm.get('channelName')?.value;
      const channelDescription = this.addChannelForm.get('description')?.value;
      const channelId = this.channelService.createChannel(
        this.currentUser,
        channelDescription,
        channelName
      );
      console.log(channelId);

      // todo update members within add-members dialog
    } else {
      this.errorSerivce.showErrorNotification('Form is invalid');
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
  closeElement() {}

  get email() {
    return this.addChannelForm.get('channelName');
  }
  get password() {
    return this.addChannelForm.get('description');
  }
}
