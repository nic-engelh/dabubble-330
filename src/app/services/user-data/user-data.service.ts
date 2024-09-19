import { Injectable, inject } from '@angular/core';
import {
  Auth,
  User,
  getAuth,
  updateEmail,
  updateProfile,
  updatePassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { FirebaseError } from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private auth: Auth = inject(Auth);
  private userSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    // Listen for authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  async updateDisplayName(newDisplayName: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        await updateProfile(user, { displayName: newDisplayName });
        console.log('Display name updated successfully');
      } catch (error) {
        console.error('Error updating display name:', error);
        throw error;
      }
    } else {
      throw new Error('No authenticated user');
    }
  }

  async updateEmail(newEmail: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        await updateEmail(user, newEmail);
        console.log('Email updated successfully');
      } catch (error) {
        console.error('Error updating email:', error);
        throw error;
      }
    } else {
      throw new Error('No authenticated user');
    }
  }

  async updatePhotoURL(newPhotoURL: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        await updateProfile(user, { photoURL: newPhotoURL });
        console.log('Photo URL updated successfully');
      } catch (error) {
        console.error('Error updating photo URL:', error);
        throw error;
      }
    } else {
      throw new Error('No authenticated user');
    }
  }

  getUserUID(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }

  async updatePassword(newPassword: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        await updatePassword(user, newPassword);
        console.log('Password updated successfully');
      } catch (error) {
        console.error('Error updating password:', error);
        throw error;
      }
    } else {
      throw new Error('No authenticated user');
    }
  }

  async resetPassword(email: string): Promise<void> {
     const response =  await sendPasswordResetEmail(this.auth, email);
     return response
  }
}
