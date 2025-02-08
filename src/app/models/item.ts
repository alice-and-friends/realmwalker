import {Monster} from "./monster";

export enum RarityGrade {
  Always = 'always',
  VeryCommon = 'very_common',
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
}
export class Item {
  id: string;
  type: string;
  twoHanded: boolean | undefined;
  name: string;
  icon: string;
  rarity: RarityGrade | string;
  equipable: boolean;
  bonuses: string[];
  droppedBy: Monster[] | undefined;
  value: number | undefined;
  dropMaxAmount: number | undefined;

  constructor(data: any) {
    this.id = data.id;
    this.type = data.type;
    this.twoHanded = data.twoHanded;
    this.name = data.name;
    this.icon = `/assets/icon/item/${data.icon}.svg`;
    this.rarity = data.rarity.replace('_', ' ');
    this.equipable = data.equipable;
    this.bonuses = data.bonuses;
    this.droppedBy = data.droppedBy;
    this.value = data.value;
    this.dropMaxAmount = data.dropMaxAmount;
  }
}
