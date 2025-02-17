import { Injectable } from '@angular/core';
import { User } from '../../../models/user.class';
import { DataService } from '../data-service/data.service';

interface FirebaseUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  creationTime: string;
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



    if (Object.keys(fireUser).length === 0) {
      throw new Error('Firebase-Benutzerobjekt ist leer.');
    }

    if (!fireUser) {
      return fireUser;
    }

    const username = fireUser.displayName || '';
    const email = fireUser.email || '';
    const avatarUrl = fireUser.photoURL || undefined;
    const createdAt = new Date();
    const updatedAt: Date = new Date();
    const searchName = username.toLowerCase() || '';

    // new Date(fireUser.creationTime) || new Date();

    let bubbelUser = new User(fireUser.uid, username, email, avatarUrl, createdAt, updatedAt, searchName);
    return bubbelUser;
  }


/**
 * Checks if an object is likely a Firebase User object based on common property presence.
 *
 * @param {any} obj The object to check.
 * @returns {boolean} True if the object is likely a Firebase User, false otherwise.
 */
isFirebaseUser(obj: any): boolean {
  if (!obj) {
    return false;
  }

  if (
    typeof obj.uid === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.refreshToken === 'string' &&
    obj.providerId == 'firebase'
  ) {
    return true;
  }

  return false;
}


}
