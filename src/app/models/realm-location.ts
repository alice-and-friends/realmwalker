import {NpcRole, ShopType} from "./npc";
import {Coordinates} from "./coordinates";
import {RenewableType} from "./renewable";

export enum LocationType {
  Base = 'Base',
  Dungeon = 'Dungeon',
  LeyLine = 'LeyLine',
  Npc = 'Npc',
  Renewable = 'Renewable',
  Runestone = 'Runestone',
}
export enum LocationStatus {
  Active = 'active',
  Defeated = 'defeated',
  Expired = 'expired',
}
export class RealmLocation {
  public id: string;
  public name: string;
  public type: LocationType;
  public status: LocationStatus;
  public coordinates: Coordinates;
  public level: number | undefined;
  public role: NpcRole | undefined;
  public shopType: ShopType | undefined;
  public renewableType: RenewableType | undefined;
  public spooked: boolean | undefined;
  public expiresAt: Date | undefined;

  constructor(data: any, timeDiff: number) {
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
        this.role = data.role;
        this.shopType = data.shopType;
        this.spooked = data.spooked;
        break;
      case LocationType.Renewable:
        this.renewableType = data.renewableType;
        break;
    }
    if (data.expiresAt) {
      this.expiresAt = new Date(data.expiresAt)
    }
  }
}
