export class InventoryItem {
  id: number;
  itemId: number;
  name: string;
  rarity: string;
  isEquipped: boolean;
  equipable: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.itemId = data.itemId;
    this.name = data.name;
    this.rarity = data.rarity;
    this.isEquipped = data.isEquipped;
    this.equipable = data.equipable;
  }
}
