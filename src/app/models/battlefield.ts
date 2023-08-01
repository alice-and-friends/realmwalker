import {RealmLocation} from "./realm_location";
import {Dungeon} from "./dungeon";

export class Battlefield extends RealmLocation {
  public dungeon: Dungeon;

  constructor(data: any) {
    super(data);
    this.dungeon = data.dungeon;
  }
}
