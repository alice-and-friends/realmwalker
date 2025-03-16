import {Injectable} from '@angular/core';
import {ModalController, ModalOptions} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modals: any[] = []

  constructor(private modalCtrl: ModalController) { }

  async new(modalOpts: ModalOptions): Promise<HTMLIonModalElement> {
    try {
      let modal = await this.modalCtrl.create({
        ...modalOpts
      });
      this.modals.push(modal);
      return modal;
    }
    catch (error) {
      console.error('Error creating modal:', error);
      throw error; // Re-throwing error if you need further handling in the calling code
    }
  }

  async dismiss(callback = () => {}) {
    let modal = this.modals.pop()
    await modal.dismiss('cancel').catch((error: Error) => console.error('Error closing modal', error));
    callback()
  }

  async dismissAll() {
    while(this.modals.length) {
      await this.dismiss();
    }
  }
}
