import {Item} from "./item";

export interface LootContainer {
  empty: boolean,
  gold: number,
  items: Item[],
}
