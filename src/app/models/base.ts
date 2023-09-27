import {RealmLocation} from "./realm-location";
import {Inventory} from "./inventory";

export class Base extends RealmLocation {
  inventory: Inventory

  constructor(data: any) {
    super(data);
    this.inventory = new Inventory(data.inventory)
  }
}
