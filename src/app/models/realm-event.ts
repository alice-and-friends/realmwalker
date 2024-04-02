export class RealmEvent {
  name: string
  description: string
  startAt: string
  finishAt: string
  active: boolean

  constructor(data: any) {
    this.name = data.name;
    this.description = data.description;
    this.startAt = data.startAt;
    this.finishAt = data.finishAt;
    this.active = data.active;
  }
}
