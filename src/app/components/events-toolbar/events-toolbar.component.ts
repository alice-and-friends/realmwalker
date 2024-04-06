import {Component, Input} from '@angular/core';
import {RealmEvent} from "../../models/realm-event";
import {ModalController} from "@ionic/angular";
import {EventModalComponent} from "../../pages/home/event-modal/event-modal.component";

@Component({
  selector: 'app-events-toolbar',
  templateUrl: './events-toolbar.component.html',
  styleUrls: ['./events-toolbar.component.scss'],
})
export class EventsToolbarComponent {
  @Input() active!: RealmEvent[];
  modal: HTMLIonModalElement | undefined

  constructor(private modalCtrl: ModalController) { }

  async openEventModal(event: RealmEvent) {
    try {
      this.modal = await this.modalCtrl.create({
        component: EventModalComponent,
        cssClass: 'floating-modal',
        showBackdrop: true,
        backdropDismiss: false,
        componentProps: {
          event: event,
        }
      });
      await this.modal.present();
    }
    catch (error) {
      console.error(error)
    }
  }

  showEventDetails(event: RealmEvent) {
    this.openEventModal(event)
  }
}
