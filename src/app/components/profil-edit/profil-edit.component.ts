import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
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



  constructor (private authService: AuthenticationService, private fb: FormBuilder,) {
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


  onSubmit() {
    if (this.changeProfilDataForm.valid) {
      const email = this.changeProfilDataForm.get('email')?.value;
      const userName = this.changeProfilDataForm.get('name')?.value;
      console.log('Form Submitted', this.changeProfilDataForm.value);
      //! add userdata change functions
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

}
