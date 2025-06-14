import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Item} from "../../models/item";

@Component({
  selector: 'app-items',
  templateUrl: './equipment.page.html',
  styleUrls: ['./compendium.scss'],
})
export class EquipmentPage implements OnInit {
  private items: any[] = [];
  itemTypes: any = ['amulet', 'helmet', 'armor', 'legs', 'boots', 'shield', 'weapon', 'ring']
  lines: string[] = []

  constructor(public api: ApiService) {}

  ngOnInit() {
    this.api.getCompendium('items').subscribe((items) => {
      this.items = items;
    })
  }

  getItems(type: string) {
    return this.items.filter((item: Item) => item.type === type)
  }
}
