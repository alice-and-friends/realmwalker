import {RealmLocation} from "./realm-location";

export class LeyLine extends RealmLocation {
  public capturedAt: Date | undefined;

  constructor(data: any) {
    super(data);
    this.capturedAt = data.capturedAt
  }
}
