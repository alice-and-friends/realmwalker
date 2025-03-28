import {BattleTurn} from "./battle-turn";
import {BattleParticipant} from "./battle-participant";

export enum BattleStatus {
  Ongoing = 'ongoing',
  Completed = 'completed',
  Abandoned = 'abandoned',
}

export class Battle {
  id!: string
  status!: BattleStatus
  turns!: BattleTurn[]
  currentTurn?: BattleTurn
  availableActions?: any
  nextStep?: any
  player!: BattleParticipant
  opponent!: BattleParticipant

  constructor(data: any) {
    this.id = data.id
    this.status = data.status
    this.availableActions = data.availableActions
    this.nextStep = data.nextStep
    this.turns = data.turns.map((turn: any) => new BattleTurn(turn));
    if (data.currentTurn) {
      this.currentTurn = new BattleTurn(data.currentTurn)
    }
  }
}
