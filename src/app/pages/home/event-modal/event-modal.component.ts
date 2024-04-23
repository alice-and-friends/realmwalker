import { Component } from '@angular/core';
import {RealmEvent} from "../../../models/realm-event";
import {ModalService} from "../../../services/modal.service";

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss'],
})
export class EventModalComponent {
  event!: RealmEvent

  constructor(private modalService: ModalService) { }

  async close() {
    await this.modalService.dismiss();
  }
}
