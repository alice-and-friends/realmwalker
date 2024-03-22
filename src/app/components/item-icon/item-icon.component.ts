import {Component, Input, OnInit} from '@angular/core';
import {InventoryItem} from "../../models/inventory-item";
import {Item} from "../../models/item";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-item-icon',
  templateUrl: './item-icon.component.html',
  styleUrls: ['./item-icon.component.scss'],
})
export class ItemIconComponent  implements OnInit {
  cssClass: string = ''
  @Input() item!: Item | InventoryItem

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (this.userService.activeUser?.preferences.itemFrames == 'Rarity') {
      this.cssClass = `item-frame frame-color-${this.item.rarity}`
    }
  }
}
