import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit{

  @Input() visible: boolean = false;
  @Input() message: string = ``;

  constructor() { }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.visible = false;
  }


}
