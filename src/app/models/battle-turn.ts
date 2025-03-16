export class BattleTurn {
  id!: string
  actor_type!: string
  actor_id!: string
  target_type!: string
  target_id!: string

  constructor(data: any) {
    this.id = data.id
    this.actor_type = data.actor_type
    this.actor_id = data.actor_id
    this.target_type = data.target_type
    this.target_id = data.target_id
  }
}
