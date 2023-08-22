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

@Injectable()
export class RealmwalkerApiInterceptor implements HttpInterceptor {

  constructor(private notification: NotificationService, private userService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    function shouldBeIntercepted(event: HttpResponse<any>) {
      return event.url!.includes(env.api.host);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          // This is client side error
          this.notification.presentToast(`Error: ${error.message}`, {error: true});
        } else {
          // This is server side error
          this.notification.presentToast(`Error ${error.status}: ${error.error.message || error.statusText}`, {error: true});
        }
        return throwError(() => error.message);
      }),
      map(event => {
        if (event instanceof HttpResponse && shouldBeIntercepted(event)) {

          // Check for xp/level up
          if (event.body && event.body.xpLevelChange) {

            // Update user object
            this.userService.activeUser!.xpLevelReport = event.body.xpLevelReport;
          }
        }
        return event;
      }),
    );
  }
}
