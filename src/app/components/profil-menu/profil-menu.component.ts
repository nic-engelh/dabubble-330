import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, Injectable } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ProfilEditComponent } from '../profil-edit/profil-edit.component';
import { ProfilComponent } from '../profil/profil.component';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-profil-menu',
  standalone: true,
  imports: [RouterModule, ProfilEditComponent, ProfilComponent, CommonModule],
  templateUrl: './profil-menu.component.html',
  styleUrl: './profil-menu.component.scss',
  animations: [
    trigger('slideMenu', [
      state('hidden', style({
        transform: 'translateY(430px)'
      })),
      state('visible', style({
        transform: 'translateY(0)'
      })),
      transition('hidden <=> visible', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class ProfilMenuComponent {

  @ViewChild('dialog') dialog!: ElementRef;
  @ViewChild('profilDialog') profilDialog!: ProfilComponent;

  menuVisible: boolean = false;
  profilVisible: boolean = false;


  toggleMenu() {
    setTimeout(() => {
      this.menuVisible = !this.menuVisible;
    }, 50);
  }

  open(): void {
    setTimeout(() => {
      this.menuVisible = true;
    }, 50);

  }

  close(): void {
    this.menuVisible = false;
  }

  openProfilDialog(): void {
    this.profilDialog.toggleMenu();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog.nativeElement.parentNode) {
      this.close();
    }
  }

}
