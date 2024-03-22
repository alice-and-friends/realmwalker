import { Component, OnInit } from '@angular/core';
import {AbstractLocationModalComponent} from "../location-modal.component";
import {Runestone} from "../../../../models/runestone";

@Component({
  selector: 'app-runestone-modal',
  templateUrl: './runestone-modal.component.html',
  styleUrls: ['./runestone-modal.component.scss'],
})
export class RunestoneModalComponent extends AbstractLocationModalComponent implements OnInit {

  async loadData() {
    this.loading = true;
    this.api.getRunestone(this.locationId).subscribe((data: Runestone) => {
      this.locationObject = data;
      this.loading = false
    })
  }
}
