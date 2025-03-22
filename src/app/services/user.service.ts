import { Injectable } from '@angular/core';
import {User, UserPreferences} from "../models/user";
import {ApiService} from "./api.service";
import {Router} from "@angular/router";
import {AnalyticsService} from "./analytics.service";
import {Capacitor} from "@capacitor/core";
import {environment as env} from "../../environments/environment";
import {AuthService} from "@auth0/auth0-angular";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private initialized = false;
  public loggedIn = false;
  public activeUser: User | undefined;

  constructor(private api: ApiService, private router: Router, private analytics: AnalyticsService, private auth: AuthService) {}

  async init(): Promise<void> {
    if (this.initialized) return; // Prevent multiple initializations

    console.log('⏳ Initializing user service...');

    await this.autoLogin();

    console.log('✅ User service initialized!');
    this.initialized = true;
  }

  setActiveUser(userObject: User) {
    this.activeUser = userObject
    this.analytics.setUserId(userObject.id)
  }

  nullifyActiveUser() {
    this.activeUser = undefined;
    this.loggedIn = false;
  }

  logoutAndRedirect() {
    this.nullifyActiveUser()
    void this.router.navigate(['/'])
  }

  login() {
    console.info('User service starting login procedure')
    this.api.me().subscribe({
      next: (response: any) => {
        this.setActiveUser(response);
        this.loggedIn = true;
        console.debug('User service redirecting to home route')
        // if(!this.router.url.includes('compendium')) {
        //   void this.router.navigate(['/home'])
        // }
      },
      error: (err: any) => {
        console.error('Error on login', err)
        this.logoutAndRedirect()
      }
    });
  }

  async autoLogin() {
    console.info('User service attempting auto-login')

    // Auth0
    if (this.auth.isAuthenticated$) {
      console.info('Auth0 OK', this.auth.user$)
    } else {
      console.info('Auto-login halted: Auth0 not authenticated')
      return false;
    }

    // Realmwalker
    return this.api.me().subscribe({
      next: (response: any) => {
        this.setActiveUser(response);
        console.info('User authorized:', this.activeUser)
        this.loggedIn = true;
        return true;
      },
      error: (err: any) => {
        console.error('Error on login', err)
        this.logoutAndRedirect()
        return false;
      }
    });
  }

  // async realmWalkerLogin() {
  //   this.api.me().subscribe({
  //     next: (response: any) => {
  //       this.setActiveUser(response);
  //       this.loggedIn = true;
  //       return true;
  //     },
  //     error: (err: any) => {
  //       console.error('Error on login', err)
  //       this.nullifyActiveUser()
  //       // this.logoutAndRedirect()
  //       return false;
  //     }
  //   });
  // }

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
