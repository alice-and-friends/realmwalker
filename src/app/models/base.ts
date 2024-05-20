import {RealmLocation} from "./realm-location";
import {Inventory} from "./inventory";

export class Base extends RealmLocation {
  inventory: Inventory

  constructor(data: any, timeDiff: number) {
    super(data, timeDiff);
    this.inventory = new Inventory(data.inventory)
  }
}
