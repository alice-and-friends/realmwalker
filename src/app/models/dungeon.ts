import {RealmLocation} from "./realm-location";
import {Monster} from "./monster";
import {formatList} from "../lib/util";

export class Dungeon extends RealmLocation {
  public monster!: Monster;
  public defeatedBy?: any[];
  public searchable!: boolean;
  public alreadySearched!: boolean;
  public _description?: string;

  constructor(data: any, timeDiff: number) {
    super(data, timeDiff);
    this.monster = new Monster(data.monster);
    this.defeatedBy = data.defeatedBy;
    this.searchable = data.searchable;
    this.alreadySearched = data.alreadySearched;

    if(this.defeatedBy) {
      const names: string[] = this.defeatedBy.map((actor: any) => actor.name);
      this._description = `You see a dead ${this.monster.name}. It was slain by ${formatList(names)}.`
    }
  }
}
