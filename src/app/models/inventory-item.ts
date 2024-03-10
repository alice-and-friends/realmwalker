import {Item} from "./item";

export class InventoryItem extends Item {
  itemId: string;
  equipped: boolean;

  constructor(data: any) {
    super(data);

    this.itemId = data.itemId;
    this.type = data.itemtype;
    this.equipped = data.equipped;
  }
}
