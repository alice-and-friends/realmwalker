import {slug} from "../lib/util";

export class RealmEvent {
  name: string
  slug: string
  description: string
  icon: string
  startAt: string
  finishAt: string
  active: boolean

  constructor(data: any) {
    this.name = data.name;
    this.slug = slug(data.name);
    this.description = data.description;
    this.icon = `/assets/icon/event/${this.slug}.svg`;
    this.startAt = data.startAt;
    this.finishAt = data.finishAt;
    this.active = data.active || false;
  }
}
