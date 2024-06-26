import {RealmLocation} from "./realm-location";

export class LeyLine extends RealmLocation {
  public capturedAt: Date | undefined;

  constructor(data: any, timeDiff: number) {
    super(data, timeDiff);
    this.capturedAt = data.capturedAt
  }
}
