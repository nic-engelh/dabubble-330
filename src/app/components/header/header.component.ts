import { ProfilMenuComponent } from './../profil-menu/profil-menu.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfilComponent } from '../profil/profil.component';
import { ProfilEditComponent } from '../profil-edit/profil-edit.component';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ProfilComponent,
    ProfilEditComponent,
    ProfilMenuComponent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {

  @ViewChild(ProfilMenuComponent) dialog!: ProfilMenuComponent;

  isHidden: boolean = true;
  currentUser: any;

  constructor(
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser);
    });
  }

  openDialog(): void {
    this.dialog.open();
  }
}
