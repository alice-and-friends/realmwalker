import {Item} from "./item";
import {capitalize, determineArticle} from "../lib/util";

export class LootContainer {
  empty!: boolean;
  gold: number;
  items: Item[];

  constructor(data: any) {
    this.empty = data.empty;
    this.gold = data.gold || 0;
    this.items = data.items || [];
  }

  formattedLootList() {
    let loot: string[] = []
    for (let item of this.items!) loot.push(`${determineArticle(item.name)} ${item.name.toLowerCase()}`)
    if (this.gold) loot.push(`${this.gold} gold coins`)
    return capitalize(loot.join(', '))
  }
}
