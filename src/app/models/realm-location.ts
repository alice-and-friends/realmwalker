import {NpcRole, ShopType} from "./npc";
import {Coordinates} from "./coordinates";
import {Monster} from "./monster";

export enum LocationType {
  Dungeon = 'Dungeon',
  Battlefield = 'Battlefield',
  Npc = 'Npc',
  Base = 'Base',
  LeyLine = 'LeyLine'
}
export class RealmLocation {
  public id: string;
  public name: string;
  public type: LocationType;
  public coordinates: Coordinates;
  public monster: Monster | undefined;
  public npcDetails: {
    role: NpcRole,
    shopType: ShopType | undefined
  } | undefined;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.locationType;
    this.coordinates = new Coordinates(data.coordinates);
    switch(this.type) {
      case LocationType.Dungeon:
        this.monster = new Monster(data.monster);
        break;
      case LocationType.Npc:
        this.npcDetails = data.npcDetails;
        break;
    }
  }
}
