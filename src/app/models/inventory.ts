import {InventoryItem} from "./inventory-item";

export class Inventory {
  id!: string;
  gold!: number;
  items!: InventoryItem[];

  constructor(data: any) {
    this.id = data.id
    this.gold = data.gold;
    this.items = data.items.map((item: any) => new InventoryItem(item));
  }
}
