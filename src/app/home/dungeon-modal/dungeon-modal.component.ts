import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {LocationType} from "../../models/realm-location";
import {ApiService} from "../../services/api.service";
import {Dungeon} from "../../models/dungeon";
import {Battlefield} from "../../models/battlefield";
import {Npc} from "../../models/npc";

@Component({
  selector: 'app-dungeon-modal',
  templateUrl: './dungeon-modal.component.html',
  styleUrls: ['./dungeon-modal.component.scss'],
})
export class DungeonModalComponent implements OnInit {
  locationId!: string
  locationObject: undefined | Dungeon

  constructor(private modalCtrl: ModalController, private api: ApiService) {
  }

  ngOnInit() {
    this.api.getDungeon(this.locationId).subscribe((data: Dungeon) => {
      this.locationObject = data;
    })
  }

  battle() {
    this.api.battle(this.locationId).subscribe((result: any) => {
      if (result.defeated) {
        alert('Victory!')
      }
    })
  }

  cancel() {
    return this.modalCtrl.dismiss('cancel');
  }

  protected readonly LocationType = LocationType;
}
