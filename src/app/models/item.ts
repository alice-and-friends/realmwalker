export class Item {
  id: string;
  itemId: string;
  itemType: string;
  twoHanded: boolean | undefined;
  name: string;
  icon: string;
  rarity: string;
  equipable: boolean;
  bonuses: string[];

  constructor(data: any) {
    this.id = data.id;
    this.itemId = data.itemId;
    this.itemType = data.itemType;
    this.twoHanded = data.twoHanded;
    this.name = data.name;
    this.icon = `/assets/icon/item-${data.icon}.svg`
    this.rarity = data.rarity;
    this.equipable = data.equipable;
    this.bonuses = data.bonuses;
  }
}
