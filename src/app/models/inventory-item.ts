import {Item} from "./item";

export class InventoryItem extends Item {
  equipped: boolean;

  constructor(data: any) {
    super(data);

    this.equipped = data.equipped;
  }
}
