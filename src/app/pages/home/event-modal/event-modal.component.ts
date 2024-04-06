import { Component } from '@angular/core';
import {RealmEvent} from "../../../models/realm-event";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss'],
})
export class EventModalComponent {
  event!: RealmEvent

  constructor(private modalCtrl: ModalController) { }

  async close() {
    await this.modalCtrl.dismiss('cancel');
  }
}
