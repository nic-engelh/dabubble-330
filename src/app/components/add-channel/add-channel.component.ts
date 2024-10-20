import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss'
})
export class AddChannelComponent implements OnInit {
  addChannelForm!: FormGroup;
  textContent: string = '';


  constructor(private form: FormBuilder) {
    this.addChannelForm = this.form.group({
      channelName: ['', Validators.required],
      description: ['']
    })
  }

  ngOnInit(): void { }

  onSubmit() { }


    calculateRows(): number {
      const lineHeight = 25; // Adjust this value based on your font size and line height
      const minRows = 1;
      const maxRows = 100;

      const lines = this.textContent.split('\n').length;
      return Math.min(Math.max(lines, minRows), maxRows);
    }



}
