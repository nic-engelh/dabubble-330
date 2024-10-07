import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss',
})
export class ProfilComponent implements OnInit {
  @ViewChild('profilDialog') profilDialog!: ElementRef;

  profilVisible = false;

  //! Two-way binding from the parent compoente with [member]="isMember"
  isMember: boolean = false;
  isUser: boolean = true;

  currentUser: any;
  userStatus: string = 'Abwesend';
  isActive: boolean = true;

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
}
