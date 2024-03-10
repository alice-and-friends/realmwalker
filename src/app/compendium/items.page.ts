import { Component, OnInit } from '@angular/core';
import {ApiService} from "../services/api.service";
import {Item} from "../models/item";

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./compendium.scss'],
})
export class ItemsPage implements OnInit {
  private items: any = [];
  private filter: any;
  itemTypes: Set<number> = new Set()
  constructor(public api: ApiService) {}

  ngOnInit() {
    this.api.getCompendium('items').subscribe((items) => {
      this.items = items;
      this.itemTypes = new Set(this.items.map((item: Item) => item.type).sort());
    })
  }

  applyFilter(e: any) {
    console.log('ionChange fired with value: ' + e.detail.value);
    this.filter = e.detail.value
  }

  getItems() {
    let items = this.items;
    if (this.filter) {
      items = items.filter((item: Item) => item.type === this.filter)
    }
    return items
  }

  // getItems(): Item[] {
  //   return this.monsters.filter((monster: Monster) =>
  //     monster.level === level && monster.classification === classification
  //   );
  // }
}
