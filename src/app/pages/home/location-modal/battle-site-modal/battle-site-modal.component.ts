import {Component, OnInit} from '@angular/core';
import {Dungeon} from "../../../../models/dungeon";
import {AbstractLocationModalComponent} from "../location-modal.component";
import {LootContainer} from "../../../../models/loot-container";

@Component({
  selector: 'app-battle-site-modal',
  templateUrl: './battle-site-modal.component.html',
  styleUrls: ['./battle-site-modal.component.scss'],
})
export class BattleSiteModalComponent extends AbstractLocationModalComponent implements OnInit {
  override locationObject!: Dungeon
  loot?: LootContainer

  async loadData() {
    this.loading = true;
    this.api.getDungeon(this.locationId).subscribe((dungeon: Dungeon) => {
      this.locationObject = dungeon;
      this.loading = false;
    })
  }

  searchDungeon() {
    this.loading = true;
    this.api.searchDungeon(this.locationId).subscribe(({loot, dungeon}) => {
      this.locationObject = dungeon;
      this.loot = loot;
      this.loading = false;
    })
  }
}
