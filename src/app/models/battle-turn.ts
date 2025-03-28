import {BattleParticipant} from "./battle-participant";
import {PlayerAction} from "./player-action";

export enum BattleTurnStatus {
  WaitingOnActor = 'waiting_on_actor',
  Committed = 'committed',
  Completed = 'completed',
}

export class BattleTurn {
  id!: string
  sequence!: number
  status!: BattleTurnStatus
  actor!: BattleParticipant
  target!: BattleParticipant
  availableActions?: PlayerAction[]

  constructor(data: any) {
    this.id = data.id
    this.sequence = data.sequence
    this.status = data.status
    this.actor = new BattleParticipant(data.actor)
    this.target = new BattleParticipant(data.target)
    if (data.availableActions) {
      this.availableActions = data.availableActions.map((action: any) => new PlayerAction(action));
    }
  }
}
