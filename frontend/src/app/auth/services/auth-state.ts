import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

const TOKEN_KEY = 'medconnect_access_token';
const USER_KEY = 'medconnect_user';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  readonly _currentUser = new BehaviorSubject<User | null>(null);

  get currentUser() {
    return this._currentUser.value;
  }
  get isLoggedIn() {
    return this._currentUser.value !== null;
  }
  get accessToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  setSession(token: string, user: User) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._currentUser.next(user);
  }
  updateToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._currentUser.next(null);
  }
  initialize() {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);
    if (!token || !userJson) {
      this.clear();
      return;
    }
    try {
      const user: User = JSON.parse(userJson);
      this._currentUser.next(user);
    } catch {
      this.clear();
    }
  }
}
