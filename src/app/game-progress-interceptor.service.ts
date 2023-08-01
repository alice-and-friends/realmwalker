import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {ToastController} from "@ionic/angular";

@Injectable()
export class GameProgressInterceptor implements HttpInterceptor {

  constructor(private toastController: ToastController) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    function checkForXpChange(body: any) {
      if (body.xpLevelChange) {
        if (body.xpLevelChange.xpDiff > 0) {
          console.log('gained xp', body.xpLevelChange.xpDiff)
        }
        if (body.xpLevelChange.levelDiff > 0) {
          console.log('advanced to level', body.xpLevelChange.currentLevel)
          presentToast('bottom', 'advanced to level' + body.xpLevelChange.currentLevel)
        }
      }
    }

    function shouldBeIntercepted(event: HttpResponse<any>) {
      return true; // TODO: API only
    }

    async function presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
      // @ts-ignore
      const toast = await this.toastController.create({
        message: message,
        duration: 1500,
        position: position,
      });

      await toast.present();
    }

    return next.handle(req).pipe(map(event => {
      if (event instanceof HttpResponse && shouldBeIntercepted(event)) {
        event = event.clone({ body: checkForXpChange(event.body) })
      }
      return event;
    }));
  }
}
