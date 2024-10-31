import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, Injectable, Input } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ProfilEditComponent } from '../profil-edit/profil-edit.component';
import { ProfilComponent } from '../profil/profil.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { SearchMemberComponent } from '../search-member/search-member.component';
import { User } from '../../../models/user.class';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [RouterModule, ProfilEditComponent, ProfilComponent, SearchMemberComponent, CommonModule, FormsModule],
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

  @ViewChild('dialog') dialog!: ElementRef;
  @Input() channelId: string | null = null;

  addMemberVisible: boolean = false;
  addChannelVisible: boolean = false;
  searchInputVisible: boolean = false;
  selectedMembers: User[] = [];

  toggleMenu() {
    setTimeout(() => {
      this.addMemberVisible = !this.addMemberVisible;
    }, 50);
  }

  open(): void {
    setTimeout(() => {
      this.addMemberVisible = true;
    }, 50);
    console.log("Add-Member-Comp",this.channelId)
  }

  close(): void {
    this.addMemberVisible = false;
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog.nativeElement.parentNode) {
      this.close();
    }
  }

  onMembersChange(members: User[]) {
    this.selectedMembers = members;
  }

  clearMemberSelection() {
    this.selectedMembers = [];
  }

  openSearchField() {
    this.searchInputVisible = true;
  }

  closeSearchField() {
    this.searchInputVisible = false;
  }

}
