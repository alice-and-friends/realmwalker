export enum PlayerActionTypes {
  Flee = 'flee',
  Attack = 'attack',
}

export class PlayerAction {
  id!: string
  name!: string
  type!: PlayerActionTypes

  constructor(data: any) {
    this.id = data.id
    this.name = data.name
    this.type = data.type
  }
}
