import {Component, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-items',
  templateUrl: './loot.page.html',
  styleUrls: ['./compendium.scss'],
})
export class LootPage implements OnInit {
  monsters: any[] = [];
  items: any[] = [];
  lines: string[] = []

  constructor(public api: ApiService) {}

  ngOnInit() {
    this.api.getCompendium('monsters').subscribe((monsters) => {
      this.monsters = monsters;
    })
    this.api.getCompendium('items').subscribe((items) => {
      this.items = items;
    })
  }

  nix(monsterId: any, itemId: any) {
    this.lines.push(`MonsterItem.find_by(monster_id: ${monsterId}, item_id: ${itemId}).destroy`)

    console.log(this.lines.join("\n"))
  }

  add(event: any, monsterId: any) {
    const itemId = event.detail.value
    this.lines.push(`MonsterItem.create(monster_id: ${monsterId}, item_id: ${itemId})`)

    console.log(this.lines.join("\n"))
  }
}
