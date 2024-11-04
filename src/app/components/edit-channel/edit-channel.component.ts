import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {

  isInputActive: boolean = false;
  content = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, ducimus iusto deserunt dolorum eveniet in dignissimos? Atque doloremque accusantium temporibus necessitatibus sed voluptatibus reprehenderit modi eligendi. Nisi quam minima nobis!';
  textContent: string = ''
  toggleInput() {
    this.isInputActive = !this.isInputActive;
  }

  updateContent(event: Event) {
    const input = event.target as HTMLInputElement;
    this.content = input.value;
  }

  onBlur() {
    this.isInputActive = false;
  }

  calculateRows(): number {
    const lineHeight = 12; // Adjust this value based on your font size and line height
    const minRows = 1;
    const maxRows = 100;
    const lines = this.textContent.split('\n').length;
    return Math.min(Math.max(lines, minRows), maxRows);
  }

}
