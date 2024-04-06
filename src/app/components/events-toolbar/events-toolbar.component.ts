import {Component, Input} from '@angular/core';
import {RealmEvent} from "../../models/realm-event";

@Component({
  selector: 'app-events-toolbar',
  templateUrl: './events-toolbar.component.html',
  styleUrls: ['./events-toolbar.component.scss'],
})
export class EventsToolbarComponent {
  @Input() active!: RealmEvent[];

  constructor() { }

  showEventDetails(event: RealmEvent) {
    alert(event.name)
  }
}
