import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
  UserCredential,
  getIdTokenResult,
  IdTokenResult,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable, from, firstValueFrom } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private auth: Auth = inject(Auth);
  private tokenKey: string = 'token';
  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();
  public isSessionExpired$: Observable<boolean>;

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });

    this.isSessionExpired$ = this.currentUser$.pipe(
      switchMap((user) => {
        if (user) {
          return from(getIdTokenResult(user)).pipe(
            map((tokenResult) => this.isTokenExpired(tokenResult))
          );
        } else {
          return [false];
        }
      })
    );
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      return token;
    } else {
      console.error('No token found.');
    }
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  userIsLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private isTokenExpired(tokenResult: IdTokenResult): boolean {
    return tokenResult.expirationTime <= new Date().toISOString();
  }
}
