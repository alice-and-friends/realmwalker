import { Injectable } from '@angular/core';
import {ToastController, ToastOptions} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastController: ToastController) { }

  async presentToast(
    message: string,
    params: {
      error?: boolean;
      position?: 'top' | 'bottom' | 'middle';
    } = {}
  ) {
    const opts = params.error
      ? {
        message: message,
        duration: 3000,
        position: params.position || 'bottom',
        color: 'danger',
      }
      : {
        message: message,
        duration: 1500,
        position: params.position || 'bottom',
      };
    const toast = await this.toastController.create(opts);
    await toast.present();
  }
}
