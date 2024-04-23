import {Component, Input} from '@angular/core';
import {RealmEvent} from "../../models/realm-event";
import {EventModalComponent} from "../../pages/home/event-modal/event-modal.component";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-events-toolbar',
  templateUrl: './events-toolbar.component.html',
  styleUrls: ['./events-toolbar.component.scss'],
})
export class EventsToolbarComponent {
  @Input() active!: RealmEvent[];
  modal: HTMLIonModalElement | undefined

  constructor(private modalService: ModalService) { }

  async openEventModal(event: RealmEvent) {
    this.modal = await this.modalService.new({
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

  showEventDetails(event: RealmEvent) {
    this.openEventModal(event)
  }
}
