import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { map } from 'rxjs/operators';
import {environment as env} from "../../environments/environment";
import {NotificationService} from "./notification.service";
import {UserService} from "./user.service";
import {LocationService} from "./location.service";

@Injectable()
export class RealmwalkerApiInterceptor implements HttpInterceptor {

  constructor(private notification: NotificationService, private userService: UserService, public location: LocationService) {}

  requestShouldBeIntercepted(req: HttpRequest<any>) {
    return req.url!.includes(env.api.host);
  }
  responseShouldBeIntercepted(event: HttpResponse<any>) {
    return event.url!.includes(env.api.host);
  }

  handleError(errorResponse: HttpErrorResponse) {
    console.error(errorResponse)
    let errorMsg = '';
    if (errorResponse.error instanceof ErrorEvent) {
      // This is client side error
      this.notification.presentToast(`Error ${errorResponse.message}:`, {error: true});
    } else if (errorResponse.status === 0) {
      // This is a network error
      this.notification.presentToast('Lost connection to server', {error: true});
    } else {
      // This is server side error
      this.notification.presentToast(`Error ${errorResponse.status}: ${errorResponse.error.message || errorResponse.statusText}`, {error: true});
    }
    return throwError(() => errorResponse.message);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.requestShouldBeIntercepted(req)) {
      if (!!this.location.lat && !!this.location.lng) {
        const geoLocation = `${this.location.lat} ${this.location.lng}`;
        req = req.clone({
          setHeaders: { Geolocation: `${geoLocation}` }
        });
      } else {
        console.warn('Interceptor was not able to get location from location service for request', req)
      }
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map(response => {
        if (response instanceof HttpResponse && this.responseShouldBeIntercepted(response)) {

          // Check for changes in xp or level
          if (response.body && response.body.xpLevelChange) {

            // Update user object
            this.userService.activeUser!.xpLevelReport = response.body.xpLevelReport;
          }
        }
        return response;
      }),
    );
  }
}
