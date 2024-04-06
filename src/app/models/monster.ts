import {slug} from "../lib/util";

export class Monster {
  name: string
  slug: string
  classification: string
  description: string
  icon: string
  level: number
  items: any

  constructor(data: any) {
    this.name = data.name;
    this.slug = slug(data.name)
    this.classification = data.classification;
    this.description = data.description;
    this.icon = `/assets/icon/monster/${this.slug}.svg`;
    this.level = data.level;
    this.items = data.items;
  }
}
