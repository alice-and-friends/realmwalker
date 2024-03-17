import { Injectable } from '@angular/core';
import {User, UserPreferences} from "../models/user";
import {ApiService} from "./api.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public loggedIn = false;
  public activeUser: User | undefined;

  constructor(private api: ApiService, private router: Router) {}

  logout() {
    this.activeUser = undefined;
    this.loggedIn = false;
    this.router.navigate(['/launch'])
  }

  login() {
    console.info('User service starting login procedure')
    this.api.me().subscribe({
      next: (response: any) => {
        this.activeUser = response;
        this.loggedIn = true;
        console.debug('User service redirecting to home route')
        this.router.navigate(['/home'])
      },
      error: (err: any) => {
        console.error('Error on login', err)
        this.logout()
      }
    });
  }

  refresh() {
    this.api.me().subscribe({
      next: (response: any) => {
        this.activeUser = response;
      },
      error: (err: any) => {
        console.error('Refresh user failed', err)
      }
    });
  }

  updatePreference(key: string, value: string|number|boolean) {
    // @ts-ignore
    this.activeUser!.preferences[key] = value; // Optimistic update

    this.api.updatePreference(key, value).subscribe({
      next: (preferences: UserPreferences) => {
        this.activeUser!.preferences = preferences;
      },
      error: (err: any) => {
        console.error('Update user preference failed', err)
      }
    })
  }
}
