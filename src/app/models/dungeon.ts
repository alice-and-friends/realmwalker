import {RealmLocation} from "./realm-location";
import {Monster} from "./monster";

export class Dungeon extends RealmLocation {
  public monster!: Monster;

  constructor(data: any, timeDiff: number) {
    super(data, timeDiff);
    this.monster = new Monster(data.monster);
  }
}
