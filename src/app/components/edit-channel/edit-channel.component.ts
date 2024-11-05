import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Channel } from '../../../models/channel.class';
import { User } from '../../../models/user.class';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent implements OnInit {

  editChannelisOpen: boolean = true;
  isInputActive: boolean = false;
  textContent: string = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, ducimus iusto deserunt dolorum eveniet in dignissimos? Atque doloremque accusantium temporibus necessitatibus sed voluptatibus reprehenderit modi eligendi. Nisi quam minima nobis!'

  currentUser: User | undefined;
  selectedChannel: Channel | undefined;

  currentEditImageUrl = '/assets/img/edit_default.svg';
  currentCheckImageUrl = '/assets/img/check_circle_default.svg';


  ngOnInit(): void { }

  toggleInput() {
    this.isInputActive = !this.isInputActive;
  }

  updateContent(event: Event) {
    const input = event.target as HTMLInputElement;
    this.textContent= input.value;
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
      this.currentCheckImageUrl = this.currentCheckImageUrl === '/assets/img/check_circle_default.svg' ? '/assets/img/check_circle_clicked.svg' : '/assets/img/check_circle_default.svg';
    } if (!this.isInputActive) {
      this.currentEditImageUrl = this.currentEditImageUrl === '/assets/img/edit_default.svg' ? '/assets/img/edit_clicked.svg' : '/assets/img/edit_default.svg';
    } else { }
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

}
