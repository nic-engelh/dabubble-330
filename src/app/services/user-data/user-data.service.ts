import { Injectable } from '@angular/core';
import { getAuth, updateEmail, updateProfile, updatePassword, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private user: User | null = null;

  constructor() {
    this.user = getAuth().currentUser;
  }

  updateDisplayName(newDisplayName: string) {
    if (this.user) {
      updateProfile(this.user, {
        displayName: newDisplayName,
      });
    }
  }

  updateEmail(newEmail: string) {
    if (this.user) {
      updateEmail(this.user, newEmail);
    }
  }

  updatePhotoURL(newPhotoURL: string) {
    if (this.user) {
      updateProfile(this.user, {
        photoURL: newPhotoURL,
      });

    }
  }

  getUserUID(): string | null {
    return this.user?.uid ?? null;
  }

  updatePassword(newPassword: string) {
    if (this.user) {
      updatePassword(this.user, newPassword)
      .then(() => {
        console.log('User password updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating user password:', error);
      });
    }
  }
}
