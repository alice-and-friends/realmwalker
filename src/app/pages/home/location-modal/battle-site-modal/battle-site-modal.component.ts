import {Component, OnInit} from '@angular/core';
import {Dungeon} from "../../../../models/dungeon";
import {AbstractLocationModalComponent} from "../location-modal.component";
import {formatList} from "../../../../lib/util";

@Component({
  selector: 'app-battle-site-modal',
  templateUrl: './battle-site-modal.component.html',
  styleUrls: ['./battle-site-modal.component.scss'],
})
export class BattleSiteModalComponent extends AbstractLocationModalComponent implements OnInit {
  description?: string;

  async loadData() {
    this.loading = true;
    this.api.getDungeon(this.locationId).subscribe((data: Dungeon) => {
      this.locationObject = data;
      this.loading = false

      const names = this.locationObject.defeatedBy.map((actor: any) => actor.name);
      this.description = `You see a dead ${this.locationObject.monster.name}. It was slain by ${formatList(names)}.`
    })
  }

  search() {
  }
}
