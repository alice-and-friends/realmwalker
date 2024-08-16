import {Injectable} from '@angular/core';
import {ToastController} from "@ionic/angular";
import {SoundAsset, SoundService} from "./sound.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastController: ToastController, private soundService: SoundService) { }

  async presentToast(
    message: string,
    params: {
      error?: boolean;
      position?: 'top' | 'bottom' | 'middle';
    } = {}
  ) {
    if (params.error) {
      void this.soundService.playSound(SoundAsset.Error)
    }

    const opts = params.error
      ? {
        message: message,
        duration: 3000,
        position: params.position || 'bottom',
        color: 'danger',
      }
      : {
        message: message,
        duration: 2000,
        position: params.position || 'bottom',
      };
    const toast = await this.toastController.create(opts);
    await toast.present();
  }
}
