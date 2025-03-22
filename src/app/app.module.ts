import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {AnimationController, IonicModule, IonicRouteStrategy} from '@ionic/angular';
import { AuthModule } from '@auth0/auth0-angular';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';

import { environment as env } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {RealmwalkerApiInterceptor} from "./services/realmwalker-api-interceptor.service";
import {NotificationService} from "./services/notification.service";
import {UserService} from "./services/user.service";
import {LocationService} from "./services/location.service";
import {MapService} from "./services/map.service";

export function initUserService(userService: UserService) {
  return () => userService.init(); // Return a function that returns a Promise
}

export function initLocationService(locationService: LocationService) {
  return () => locationService.init(); // Return a function that returns a Promise
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      navAnimation: _ => new AnimationController().create(), // Disables route transition animations
      innerHTMLTemplatesEnabled: true, // Enables html support in alert boxes
    }),
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot({
      ...env.auth0,
      httpInterceptor: {
        /**
         * Here we define which API endpoints should include Authorization headers.
         * For security reasons, we must only send those headers when necessary.
         * Read more: https://auth0.com/blog/complete-guide-to-angular-user-authentication/#Protecting-Routes
         */
        allowedList: [
          `${env.realmwalkerApi.host}/*`, // This applies Auth headers for all calls to our internal API
        ],

      },
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RealmwalkerApiInterceptor,
      multi: true,
      deps: [NotificationService, UserService, LocationService, MapService]
    },
    UserService,
    {
      provide: APP_INITIALIZER,
      useFactory: initUserService,
      deps: [UserService],
      multi: true
    },
    LocationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initLocationService,
      deps: [LocationService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
