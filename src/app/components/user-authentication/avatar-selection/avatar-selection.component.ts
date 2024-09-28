import { AuthenticationService } from './../../../services/authentication-service/authentication.service';
import { UserDataService } from './../../../services/user-data/user-data.service';
import { RouterModule, Router } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-avatar-selection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ModalComponent],
  templateUrl: './avatar-selection.component.html',
  styleUrl: './avatar-selection.component.scss',
})
export class AvatarSelectionComponent implements OnInit {
  private storage: Storage = inject(Storage);
  private fb: FormBuilder = inject(FormBuilder);
  avatarForm: FormGroup;
  avatars: string[] = [
    'avatar_female_small_1.svg',
    'avatar_female_small_6.svg',
    'avatar_male_small_2.svg',
    'avatar_male_small_3.svg',
    'avatar_male_small_4.svg',
    'avatar_male_small_5.svg',
  ];
  selectedAvatar: string | null = null;
  uploadPercent: number | null = null;
  uploadedAvatarUrl: string | null = null;
  message: string = `Konto erfolgreich erstellt!`;
  showModal: boolean = false;

  constructor(
    private userDataService: UserDataService,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.avatarForm = this.fb.group({
      avatarType: ['predefined', Validators.required],
      predefinedAvatar: [null, Validators.required],
      customAvatar: [null],
    });
  }

  ngOnInit(): void {}

  onAvatarSelect(avatar: string): void {
    this.selectedAvatar = avatar;
    this.avatarForm.patchValue({ predefinedAvatar: avatar });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const filePath = `avatars/${new Date().getTime()}_${file.name}`;
      const storageRef = ref(this.storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploadPercent = progress;
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //! find a solution to uploadedAvatarURL not being null
            this.uploadedAvatarUrl = downloadURL;
            console.log(this.uploadedAvatarUrl);
            this.avatarForm.patchValue({ customAvatar: downloadURL });
          });
        }
      );
    }
  }

  async saveAvatarAtProfile(URL: string) {
    let response;
    if (URL) {
      response = await this.userDataService.updatePhotoURL(URL);
      console.log(response);
    }
  }

  onSubmit(): void {
    const userStatus = this.authService.userIsLoggedIn();

    if (this.avatarForm.valid) {
      console.log('Form submitted:', this.avatarForm.value);
      // Here you would typically send the form data to your backend
      this.saveAvatarAtProfile(this.uploadedAvatarUrl!);
      if (userStatus) {
        this.authService.logout();
      }
      this.showModal = true;
      setTimeout(() => {
        this.showModal = false;
      }, 200);
      setTimeout(() => {
        this.router.navigate(['/auth/log-in']);
      }, 1300);
    }
  }

  setAvatarOnDefault() {
    this.uploadedAvatarUrl = null;
    this.selectedAvatar = `profile.svg`;
  }
}
