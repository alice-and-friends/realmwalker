import {InventoryItem} from "./inventory-item";
import {TradeOffer} from "./trade-offer";

export class Inventory {
  gold: number;
  items: InventoryItem[];

  constructor(data: any) {
    this.gold = data.gold;
    this.items = data.items.map((item: any) => new InventoryItem(item));
  }
}
