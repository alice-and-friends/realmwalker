import {RealmLocation} from "./realm-location";
import {Inventory} from "./inventory";

export enum RenewableType {
  Mine = 'mine',
  FlowerForest = 'flower_forest',
}
export class Renewable extends RealmLocation {
  icon: string;
  inventory: Inventory
  nextGrowthAt?: Date;

  constructor(data: any, timeDiff: number) {
    super(data, timeDiff);
    this.icon = `/assets/icon/location/${data.renewableType}.svg`
    this.inventory = new Inventory(data.inventory)

    if (data.nextGrowthAt) {
      console.log(data.nextGrowthAt, !!data.nextGrowthAt)
      this.nextGrowthAt = new Date(new Date(data.nextGrowthAt).getTime() + timeDiff);
    }
  }
}
