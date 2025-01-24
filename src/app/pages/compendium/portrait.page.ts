import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-items',
  templateUrl: './portraits.page.html',
  styleUrls: ['./compendium.scss'],
})
export class PortraitPage implements OnInit {
  portraits: any[] = [];

  constructor(public api: ApiService) {}

  ngOnInit() {
    this.api.getCompendium('portraits').subscribe((portraits) => {
      this.portraits = portraits;
    })
  }
}
