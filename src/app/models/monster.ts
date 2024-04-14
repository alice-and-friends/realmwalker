import {slug} from "../lib/util";

export class Monster {
  id: number
  name: string
  slug: string
  classification: string
  description: string
  icon: string
  level: number
  items: any

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.slug = slug(data.name)
    this.classification = data.classification;
    this.description = data.description;
    this.icon = `/assets/icon/monster/${this.slug}.svg`;
    this.level = data.level;
    this.items = data.items;
  }
}
