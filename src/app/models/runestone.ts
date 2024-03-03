import {RealmLocation} from "./realm-location";

export class Runestone extends RealmLocation {
  text: string

  constructor(data: any) {
    super(data);
    this.text = data.text
  }
}
