export class BattleParticipant {
  id!: string
  name!: string
  type!: string
  isAPlayer!: boolean
  isCurrentUser!: boolean

  constructor(data: any) {
    this.id = data.id
    this.name = data.name
    this.type = data.type
    this.isAPlayer = data.isAPlayer
    this.isCurrentUser = data.isCurrentUser
  }
}
