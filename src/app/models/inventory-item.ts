export class InventoryItem {
  id: string;
  itemId: string;
  itemType: string;
  twoHanded: boolean | undefined;
  name: string;
  rarity: string;
  isEquipped: boolean;
  equipable: boolean;
  bonuses: string[];

  constructor(data: any) {
    this.id = data.id;
    this.itemId = data.itemId;
    this.itemType = data.itemType;
    this.twoHanded = data.twoHanded;
    this.name = data.name;
    this.rarity = data.rarity;
    this.isEquipped = data.isEquipped;
    this.equipable = data.equipable;
    this.bonuses = data.bonuses;
  }
}
