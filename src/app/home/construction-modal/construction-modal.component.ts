import { Component } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-battle-result-modal',
  templateUrl: './construction-modal.component.html',
  styleUrls: ['./construction-modal.component.scss'],
})
export class ConstructionModalComponent {
  title = 'Build your Home Base'
  description = '<p>You can select your current location as your home base.</p>' +
    '<p>Your base is a safe place to store items and plays a vital role in quests. Make it count by placing it somewhere you spend a lot of time.</p>'
  primaryAction = 'Establish base here'
  cancelAction = 'Maybe later'
  openBaseModal!: Function

  constructor(private modalCtrl: ModalController) {}

  constructBase() {
    this.openBaseModal();
  }

  cancel() {
    this.modalCtrl.dismiss('cancel');
  }
}
