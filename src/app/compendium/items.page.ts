import {Component, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {Item} from "../models/item";

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./compendium.scss'],
})
export class ItemsPage implements OnInit {
  private items: any[] = [];
  private filter: any;
  monsters: any[] = [];
  itemTypes: any = new Set()
  lines: string[] = []
  standardPriceRange: any = {
    'common': [1, 150],
    'uncommon': [100, 10_000],
    'rare': [1_000, 50_000],
    'epic': [50_000, 100_000],
  }

  constructor(public api: ApiService) {}

  ngOnInit() {
    this.api.getCompendium('monsters').subscribe((monsters) => {
      this.monsters = monsters;
    })
    this.api.getCompendium('items').subscribe((items) => {
      this.items = items;
      this.itemTypes = new Set(this.items.map((item: Item) => item.type).sort());
    })
  }

  applyFilter(event: any) {
    console.log('ionChange fired with value: ' + event.detail.value);
    this.filter = event.detail.value
  }

  getItems() {
    let items = this.items;
    if (this.filter) {
      items = items.filter((item: Item) => item.type === this.filter)
    }
    return items
  }

  typicalPrice(rarity: string, price: number): boolean {
    const range = this.standardPriceRange[rarity]
    if (price && range) {
      if (price < range[0]) return false
      if (price > range[1]) return false
    }
    return true
  }


  nix(monsterId: any, itemId: any) {
    this.lines.push(`MonsterItem.find_by(monster_id: ${monsterId}, item_id: ${itemId}).destroy`)

    console.log(this.lines.join("\n"))
  }

  add(event: any, itemId: any) {
    const monsterId = event.detail.value
    this.lines.push(`MonsterItem.create(monster_id: ${monsterId}, item_id: ${itemId})`)

    console.log(this.lines.join("\n"))
  }
}
