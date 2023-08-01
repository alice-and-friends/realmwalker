import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {AnimationController, IonicModule, IonicRouteStrategy} from '@ionic/angular';
import { AuthModule } from '@auth0/auth0-angular';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';

import { environment as env } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {GameProgressInterceptor} from "./game-progress-interceptor.service";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      navAnimation: _ => new AnimationController().create() // Disables route transition animations
    }),
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot({
      ...env.auth,
      httpInterceptor: {
        /**
         * Here we define which API endpoints should include Authorization headers.
         * For security reasons, we must only send those headers when necessary.
         * Read more: https://auth0.com/blog/complete-guide-to-angular-user-authentication/#Protecting-Routes
         */
        allowedList: [
          `${env.api.host}/*`, // This applies Auth headers for all calls to our internal API
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
      useClass: GameProgressInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
