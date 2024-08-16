import {Component, NgZone, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {UserService} from "../../services/user.service";
import {LocationService} from "../../services/location.service";
import {Browser} from "@capacitor/browser";
import { environment as env } from '../../../environments/environment';
import {Capacitor} from "@capacitor/core";
import {AnalyticsService} from "../../services/analytics.service";

@Component({
  selector: 'app-launch',
  templateUrl: './launch.page.html',
  styleUrls: ['./launch.page.scss'],
})
export class LaunchPage {
  constructor(private analytics: AnalyticsService, public auth: AuthService, public userService: UserService, public location: LocationService) { }

  handleLogin(): void {
    this.analytics.events.login()

    if (!this.location.permissionsGranted()) {
      alert("Unable to log in. Please check location permissions.");
      return;
    }

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

  private webLogin() {
    this.auth.loginWithRedirect({
      appState: {
        target: '/home',
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
          target: '/home',
        },
      })
      .subscribe({
        next: (response: any) => {
          console.log(1, this.auth.isAuthenticated$)
          // void this.router.navigate(['/home'])
        },
        error: (err: any) => {
          console.error(err)
        }
      });
  }

  protected readonly document = document;
}
