import { Injectable } from '@angular/core';
import {User, UserPreferences} from "../models/user";
import {ApiService} from "./api.service";
import {Router} from "@angular/router";
import {AnalyticsService} from "./analytics.service";
import {Capacitor} from "@capacitor/core";
import {environment as env} from "../../environments/environment";
import {AuthService} from "@auth0/auth0-angular";
import {firstValueFrom} from "rxjs";
import {Browser} from "@capacitor/browser";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private initialized = false;
  private platform = Capacitor.getPlatform();
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

  async autoLogin() {
    console.info('User service attempting auto-login')

    // Auth0
    if (await firstValueFrom(this.auth.isAuthenticated$)) {
      console.info('Auto-login: Auth0 OK')
    } else {
      console.info('Auto-login halted: Auth0 not authenticated')
      return false;
    }

    // Realmwalker server auth
    return this.getRealmWalkerUser();
  }

  logoutAndRedirect() {
    console.log('logoutAndRedirect called...')

    if (this.platform === 'web') {
      console.log('web logout')
      this.auth.logout({ logoutParams: { returnTo: document.location.origin } })
    }
    else {
      console.log('native logout')
      const returnTo = `${env.auth0.appId}://${env.auth0.domain}/capacitor/${env.auth0.appId}/callback`;

      this.auth
        .logout({
          logoutParams: {
            returnTo,
          },
          async openUrl(url: string) {
            await Browser.open({ url });
          }
        })
        .subscribe({
          next: () => {
            this.nullifyActiveUser()
            void this.router.navigate(['/'])
          }
        });
    }
  }

  async getRealmWalkerUser() {
    console.log('Authorizing user against game api...')
    this.api.me().subscribe({
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
