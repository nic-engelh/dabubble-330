import { Injectable } from '@angular/core';
import { User } from '../../../models/user.class';
import { DataService } from '../data-service/data.service';

interface FirebaseUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  // Weitere Firebase-Benutzereigenschaften
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private dataService: DataService) { }

  /**
   * Transforms a Firebase user object into a Bubbel user object.
   *
   * @param {FirebaseUser} fireUser - The Firebase user object to transform.
   * @returns {User} - The transformed Bubbel user object.
   * @throws {Error} - Throws an error if the Firebase user object is invalid or the user ID is missing.
   *
   * @example
   * const firebaseUser = {
   * uid: '12345',
   * displayName: 'John Doe',
   * email: 'john.doe@example.com',
   * photoURL: 'https://example.com/avatar.jpg'
   * };
   * const bubbelUser = userService.transformFireUsertoBubbleUser(firebaseUser);
   * console.log(bubbelUser.toJson());
   */
    transformFireUsertoBubbleUser(fireUser: FirebaseUser): User {
      if (!fireUser) {
        throw new Error('Firebase-Benutzerobjekt ist ungültig.');
      }

      if (!fireUser.uid) {
        throw new Error('Firebase-Benutzer-ID fehlt.');
      }

      const username = fireUser.displayName || '';
      const email = fireUser.email || '';
      const avatarUrl = fireUser.photoURL || undefined;

      const bubbelUser = new User(fireUser.uid, username, email, avatarUrl);
      return bubbelUser;
    }


}
