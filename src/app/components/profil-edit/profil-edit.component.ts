import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { UserDataService } from '../../services/user-data/user-data.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-profil-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profil-edit.component.html',
  styleUrl: './profil-edit.component.scss'
})
export class ProfilEditComponent {
  isMember: boolean = true;
  isUser: boolean = true;
  currentUser: any;
  userStatus: string = 'Abwesend';
  isActive: boolean = true;

  changeProfilDataForm: FormGroup;
  emailFocused: boolean = false;
  nameFocused: boolean = false;

  constructor (private authService: AuthenticationService, private fb: FormBuilder, private userDataService: UserDataService) {
    this.changeProfilDataForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.pattern(/^(?:\p{L}+(?:[',. -]\p{L}+)*)?$/u)]],
    });
   }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser)
    });
  }

 async onSubmit() {
    if (this.changeProfilDataForm.valid) {
      const newEmail = this.changeProfilDataForm.get('email')?.value;
      const newUserName = this.changeProfilDataForm.get('name')?.value;
      console.log('Form Submitted', this.changeProfilDataForm.value);
      if (newEmail !== null && newUserName !== null && this.currentUser) {
        try {

          //! improve this try&catch block - needs better error handling
          await this.userDataService.updateDisplayName(newUserName);
          await this.userDataService.updateEmail(newEmail);
        } catch (error) {
          console.error(error);
        }
      }
      else {
        console.error("Check form input and current user for error.")
      }
    } else {
      console.log('Form is invalid');
    }
  }


  // Getters for easy access to form fields in the template
  get email() {
    return this.changeProfilDataForm.get('email');
  }
  get name() {
    return this.changeProfilDataForm.get('name');
  }

  cancelEditProfil() {
    //! reset form
    //! close, destory or hide modal
    //! navigate to element/route from before
  }

}
