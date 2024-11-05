import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
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

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss',
})
export class EditChannelComponent implements OnInit, OnDestroy {
  editChannelDescription!: FormGroup;
  editChannelName!: FormGroup;

  editChannelisOpen: boolean = true;
  isInputActive: boolean = false;
  nameContent: string = '';
  textContent: string =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, ducimus iusto deserunt dolorum eveniet in dignissimos?';

  currentUser: User | undefined;
  selectedChannel: Channel | undefined;
  @Input() selectedChannelId: string | undefined = 'aeae16e2-afdb-4e14-a7c0-3255f8744000';
  channelData: DocumentData | undefined;
  private subscription!: Subscription;

  currentEditImageUrl = '/assets/img/edit_default.svg';
  currentCheckImageUrl = '/assets/img/check_circle_default.svg';

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private channelService: ChannelService
  ) {}

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

  onSubmit(Form: string) {
    if (this.editChannelDescription.valid) {
      console.log('Form Submitted', this.editChannelDescription.value);
      // Handle valid form submission here
    } else {
      this.editChannelDescription.markAllAsTouched(); // Mark all controls as touched to trigger validation messages
    }
  }

  toggleInput() {
    this.isInputActive = !this.isInputActive;
  }

  updateContent(event: Event) {
    const input = event.target as HTMLInputElement;
    this.textContent = input.value;
  }

  onInput(): void {
    // Trigger change detection
    this.textContent = this.textContent; // This line is actually unnecessary since we are using ngModel
  }
  onBlur() {
    this.isInputActive = false;
  }

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

  toggleImage() {
    if (this.isInputActive) {
      this.currentCheckImageUrl =
        this.currentCheckImageUrl === '/assets/img/check_circle_default.svg'
          ? '/assets/img/check_circle_clicked.svg'
          : '/assets/img/check_circle_default.svg';
    }
    if (!this.isInputActive) {
      this.currentEditImageUrl =
        this.currentEditImageUrl === '/assets/img/edit_default.svg'
          ? '/assets/img/edit_clicked.svg'
          : '/assets/img/edit_default.svg';
    } else {
    }
  }

  showCheckClickedImage() {
    this.currentCheckImageUrl = '/assets/img/check_circle_default.svg'; // Temporary image on click
    // Return to default image after a short delay
    setTimeout(() => {
      this.currentCheckImageUrl = '/assets/img/check_circle_clicked.svg';
    }, 100); // 200 ms delay, adjust as needed
  }

  showEditClickedImage() {
    this.currentEditImageUrl = '/assets/img/edit_clicked.svg'; // Temporary image on click
    // Return to default image after a short delay
    setTimeout(() => {
      this.currentEditImageUrl = '/assets/img/edit_default.svg';
    }, 100); // 200 ms delay, adjust as needed
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
