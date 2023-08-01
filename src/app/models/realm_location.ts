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
  public locationMapDetail: any;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.locationType;
    this.coordinates = [data.coordinates.y, data.coordinates.x];
    this.locationMapDetail = data.locationMapDetail;
  }
}
