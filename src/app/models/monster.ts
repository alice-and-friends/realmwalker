export class Monster {
  name: string
  classification: string
  description: string
  icon: string
  level: number
  items: any

  constructor(data: any) {
    this.name = data.name;
    this.classification = data.classification;
    this.description = data.description;
    this.icon = '/assets/icon/monster/' + this.name
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, '-')
      .toLowerCase() + '.svg';
    this.level = data.level;
    this.items = data.items;
  }
}
