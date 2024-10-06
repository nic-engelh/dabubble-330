import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, Injectable } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ProfilEditComponent } from '../profil-edit/profil-edit.component';
import { ProfilComponent } from '../profil/profil.component';

@Component({
  selector: 'app-profil-menu',
  standalone: true,
  imports: [RouterModule, ProfilEditComponent, ProfilComponent, CommonModule],
  templateUrl: './profil-menu.component.html',
  styleUrl: './profil-menu.component.scss'
})
export class ProfilMenuComponent {

  @ViewChild('dialog') dialog!: ElementRef;
  isOpen: boolean = false;
  isHidden: boolean = false;

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog.nativeElement.parentNode) {
      this.close();
    }
  }

}
