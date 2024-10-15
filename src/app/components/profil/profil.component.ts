import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { ProfilEditComponent } from '../profil-edit/profil-edit.component';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, RouterModule, ProfilEditComponent],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss',
})
export class ProfilComponent implements OnInit {
  @ViewChild('profilDialog') profilDialog!: ElementRef;
  @ViewChild('profilEditDialog') profilEditDialog!: ProfilEditComponent;

  profilVisible: boolean = false;
  profilEditIsVisible: boolean = false;

  //! Two-way binding from the parent compoente with [member]="isMember"
  isMember: boolean = false;
  isUser: boolean = true;

  currentUser: any;
  userStatus: string = 'Abwesend';
  isActive: boolean = true;

  editImageURL: string = '/assets/img/edit.svg';
  closeIconPath: string = '/assets/img/close-default.svg';

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser);
    });
  }

  toggleMenu() {
    setTimeout(() => {
      this.profilVisible = !this.profilVisible;
    }, 50);
  }

  open(): void {
    setTimeout(() => {
      this.profilVisible = true;
    }, 50);
  }

  close(): void {
    this.profilVisible = false;
  }

  openProfilEdit() {
    this.close();
    this.profilEditDialog.isVisible = true;
    this.changeEditImage();
  }

  closeProfilEdit() {
    this.profilEditIsVisible = false;
    this.profilEditDialog.isVisible = false;
  }

  changeEditImage() {
    this.editImageURL = this.editImageURL === '/assets/img/edit.svg'
      ? '/assets/img/edit-hover.svg'
      : '/assets/img/edit.svg';
  }

}
