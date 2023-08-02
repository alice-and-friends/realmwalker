import {RealmLocation} from "./realm-location";

type Monster = {
  name: string
  classification: string
  description: string
}
export class Dungeon extends RealmLocation {
  public monster: Monster;
  public level: number;

  constructor(data: any) {
    super(data);
    this.monster = data.monster;
    this.level = data.level;
  }
}
