import { Component } from '@angular/core';
import {AnalyticsService} from "../../../services/analytics.service";
import {ModalService} from "../../../services/modal.service";

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

  constructor(private analytics: AnalyticsService, private modalService: ModalService) {}

  constructBase() {
    this.analytics.events.buildBase()
    this.openBaseModal();
  }

  cancel() {
    void this.modalService.dismiss();
  }
}
