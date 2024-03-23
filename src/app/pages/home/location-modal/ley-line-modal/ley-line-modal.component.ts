import { Component, OnInit } from '@angular/core';
import {AbstractLocationModalComponent} from "../location-modal.component";
import {LeyLine} from "../../../../models/ley-line";

@Component({
  selector: 'app-ley-line-modal',
  templateUrl: './ley-line-modal.component.html',
  styleUrls: ['./ley-line-modal.component.scss'],
})
export class LeyLineModalComponent extends AbstractLocationModalComponent implements OnInit {

  async loadData() {
    this.loading = true;
    this.api.getLeyLine(this.locationId).subscribe((data: LeyLine) => {
      this.locationObject = data;
      this.loading = false
    })
  }
}
