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
  public icon: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.location_type;
    this.coordinates = [data.coordinates.y, data.coordinates.x];
    this.icon = (() => {
      if(this.type == LocationType.Dungeon) return 'Paw';
      if(this.type == LocationType.Battlefield) return 'Trophy';
      if(this.type == LocationType.Npc) return 'chatbox-ellipses';
      return 'Help';
    })();
  }
}
