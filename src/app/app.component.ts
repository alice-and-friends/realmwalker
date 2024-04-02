import {Component, NgZone, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {UserService} from "./services/user.service";
import {LocationService} from "./services/location.service";
import {ApiService} from "./services/api.service";
import {App} from "@capacitor/app";
import {mergeMap} from "rxjs";
import {Browser} from "@capacitor/browser";
import {environment as env} from "../environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  localTime: Date = new Date()
  callbackUri = `${env.auth.appId}://${env.auth.domain}/capacitor/${env.auth.appId}/callback`;

  constructor(public auth: AuthService, public userService: UserService, public location: LocationService, public api: ApiService, private ngZone: NgZone, private router: Router) {}

  async ngOnInit() {
    const locationServiceOperational = await this.location.init();
    console.log('Location service reports operational:', locationServiceOperational, 'Initial position:', this.location.latitude, this.location.longitude)
    if (locationServiceOperational) {
      await this.location.track();
      this.userService.login();
    } else {
      console.warn('Login aborted due to problem with location service')
    }

    // Use Capacitor's App plugin to subscribe to the `appUrlOpen` event
    App.addListener('appUrlOpen', ({ url }) => {
      // Must run inside an NgZone for Angular to pick up the changes
      // https://capacitorjs.com/docs/guides/angular
      this.ngZone.run(() => {
        if (url?.startsWith(this.callbackUri)) {
          // If the URL is an authentication callback URL...
          if (
            url.includes('state=') &&
            (url.includes('error=') || url.includes('code='))
          ) {
            // Call handleRedirectCallback and close the browser
            this.auth
              .handleRedirectCallback(url)
              .pipe(mergeMap(() => Browser.close()))
              .subscribe({
                next: (a: any) => {
                  this.userService.login();
                }
              });
          } else {
            Browser.close();
          }
        }
        else {
          console.log('Does not contain callbackUri')
        }
      });
    });
  }
}
