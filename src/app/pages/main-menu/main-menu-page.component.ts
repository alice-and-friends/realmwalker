import {Component, NgZone, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {UserService} from "../../services/user.service";
import {LocationService} from "../../services/location.service";
import {Browser} from "@capacitor/browser";
import { environment as env } from '../../../environments/environment';
import {Capacitor} from "@capacitor/core";
import {AnalyticsService} from "../../services/analytics.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu-page.component.html',
  styleUrls: ['./main-menu-page.component.scss'],
})
export class MainMenuPage {
  constructor(private analytics: AnalyticsService, public auth: AuthService, public userService: UserService, public location: LocationService, private router: Router) { }

  ngOnInit() {
    console.log('Init Main Menu')
  }

  launchGame(): void {
    void this.router.navigate(['/home'])
  }

  userLoginAction(): void {
    this.analytics.events.login()

    // if (!this.location.permissionsGranted()) {
    //   alert("Unable to log in. Please check location permissions.");
    //   return;
    // }

    const platform = Capacitor.getPlatform();
    console.log(env.auth0.authorizationParams.redirect_uri)

    if (platform === 'web') {
      // Call web-specific login handler
      console.log('web login')
      this.webLogin();
    } else {
      // Call native mobile login handler
      console.log('native login')
      this.nativeLogin();
    }
  }

  // canLogIn() {
  //   return !this.auth.isAuthenticated$ && !this.userService.loggedIn
  // }
  //
  // canLogOut() {
  //   return this.auth.isAuthenticated$ || this.userService.loggedIn
  // }
  //
  // canLaunchGame() {
  //   return this.auth.isAuthenticated$ && this.userService.loggedIn && this.location.tracking
  // }

  private webLogin() {
    this.auth.loginWithRedirect({
      appState: {
        target: '/ ',
      },
    });
  }

  private nativeLogin() {
    // https://auth0.com/docs/quickstart/native/ionic-angular/
    this.auth
      .loginWithRedirect({
        async openUrl(url: string) {
          await Browser.open({ url, windowName: '_self' });
        },
        appState: {
          target: '/',
        },
      })
      .subscribe({
        next: (response: any) => {
          console.log(1, this.auth.isAuthenticated$)
          void this.router.parseUrl('/');
        },
        error: (err: any) => {
          console.error(err)
        }
      });
  }

  protected readonly document = document;
}
