import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, Injectable } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ProfilEditComponent } from '../profil-edit/profil-edit.component';
import { ProfilComponent } from '../profil/profil.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [RouterModule, ProfilEditComponent, ProfilComponent, CommonModule],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss',
  animations: [
    trigger('slideMenu', [
      state(
        'hidden',
        style({
          transform: 'translateY(430px)',
        })
      ),
      state(
        'visible',
        style({
          transform: 'translateY(0)',
        })
      ),
      transition('hidden <=> visible', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class AddMemberComponent {

  menuVisible: boolean = false;
  profilVisible: boolean = false;

  @ViewChild('dialog') dialog!: ElementRef;

  addMemberVisible: boolean = false;
  addChannelVisible: boolean = false;

  toggleMenu() {
    setTimeout(() => {
      this.addMemberVisible = !this.addMemberVisible;
    }, 50);
  }

  open(): void {
    setTimeout(() => {
      this.addMemberVisible = true;
    }, 50);

  }

  close(): void {
    this.addMemberVisible = false;
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog.nativeElement.parentNode) {
      this.close();
    }
  }

}
