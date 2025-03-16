import {BattleTurn} from "./battle-turn";

export class Battle {
  id!: string
  turns!: BattleTurn[]

  constructor(data: any) {
    this.id = data.id
    this.turns = data.turns.map((turn: any) => new BattleTurn(turn));
  }
}
