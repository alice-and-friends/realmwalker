import {NpcRole, ShopType} from "./npc";

export enum LocationType {
  Dungeon = 'Dungeon',
  Battlefield = 'Battlefield',
  Npc = 'Npc',
}
export class RealmLocation {
  public id: string;
  public name: string;
  public type: LocationType;
  public coordinates: number[];
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
    this.coordinates = [data.coordinates.y, data.coordinates.x];
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
