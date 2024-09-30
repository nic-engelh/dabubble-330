import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { UserDataService } from '../../services/user-data/user-data.service';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent implements OnInit {

  isMember: boolean = true;
  isUser: boolean = true;
  currentUser: any;
  userStatus: string = 'Unbekannt';
  isActive: boolean = true;

  constructor (private authService: AuthenticationService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser)
    });
  }

}
