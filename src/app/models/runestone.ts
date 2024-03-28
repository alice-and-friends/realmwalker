import {RealmLocation} from "./realm-location";

export class Runestone extends RealmLocation {
  runestoneId: string
  text: string
  discovered: boolean

  constructor(data: any) {
    super(data);
    this.runestoneId = data.runestoneId
    this.text = data.text
    this.discovered = data.discovered
  }
}
