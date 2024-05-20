import {slug} from "../lib/util";

export class RealmEvent {
  name: string
  slug: string
  description: string
  icon: string
  startAt: Date
  finishAt: Date
  active: boolean

  constructor(data: any, timeDiff: number) {
    this.name = data.name;
    this.slug = slug(data.name);
    this.description = data.description;
    this.icon = `/assets/icon/event/${this.slug}.svg`;
    this.startAt = new Date(new Date(data.startAt).getTime() + timeDiff);
    this.finishAt = new Date(new Date(data.finishAt).getTime() + timeDiff);
    this.active = data.active || false;
  }
}
