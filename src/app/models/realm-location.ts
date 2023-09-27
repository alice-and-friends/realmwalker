import {NpcRole, ShopType} from "./npc";
import {Coordinates} from "./coordinates";

export enum LocationType {
  Dungeon = 'Dungeon',
  Battlefield = 'Battlefield',
  Npc = 'Npc',
  Base = 'Base',
}
export class RealmLocation {
  public id: string;
  public name: string;
  public type: LocationType;
  public coordinates: Coordinates;
  public dungeonDetails: {
    level: number,
    monsterClassification: string
  } | undefined;
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
        this.dungeonDetails = data.dungeonDetails;
        break;
      case LocationType.Npc:
        this.npcDetails = data.npcDetails;
        break;
    }
  }
}
