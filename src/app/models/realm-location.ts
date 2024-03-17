import {NpcRole, ShopType} from "./npc";
import {Coordinates} from "./coordinates";
import {Monster} from "./monster";

export enum LocationType {
  Dungeon = 'Dungeon',
  Npc = 'Npc',
  Base = 'Base',
  LeyLine = 'LeyLine',
  Runestone = 'Runestone',
}
export enum LocationStatus {
  Expired = 'expired',
  Active = 'active',
  Defeated = 'defeated',
}
export class RealmLocation {
  public id: string;
  public name: string;
  public type: LocationType;
  public status: LocationStatus;
  public coordinates: Coordinates;
  public level: number | undefined;
  public npcDetails: {
    role: NpcRole,
    shopType: ShopType | undefined,
    spooked: boolean,
  } | undefined;
  public expiresAt: Date | undefined;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.status = data.status;
    this.coordinates = new Coordinates(data.coordinates);
    switch(this.type) {
      case LocationType.Dungeon:
        this.level = data.level
        break;
      case LocationType.Npc:
        this.npcDetails = data.npcDetails;
        break;
    }
    if (data.expiresAt) {
      this.expiresAt = new Date(data.expiresAt)
    }
  }
}
