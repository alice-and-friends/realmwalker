export class BattlePrediction {
  baseChance: number
  chanceOfSuccess: number
  overkill: number
  modifiersPositive: string[]
  modifiersNegative: string[]
  chanceOfDeath: number
  chanceOfInventoryLoss: number
  chanceOfEquipmentLoss: number
  modifiersDeath: string[]
  assessment: string

  constructor(data: any) {
    this.baseChance = data.baseChance
    this.chanceOfSuccess = data.chanceOfSuccess
    this.overkill = data.overkill
    this.modifiersPositive = data.modifiersPositive
    this.modifiersNegative = data.modifiersNegative
    this.chanceOfDeath = data.chanceOfDeath
    this.chanceOfInventoryLoss = data.chanceOfInventoryLoss
    this.chanceOfEquipmentLoss = data.chanceOfEquipmentLoss
    this.modifiersDeath = data.modifiersDeath

    if (this.chanceOfSuccess >= 95) {
      this.assessment = "Trivial"
    } else if (this.chanceOfSuccess >= 90) {
      this.assessment = "Easy"
    } else if (this.chanceOfSuccess >= 80) {
      this.assessment = "Risky"
    } else if (this.chanceOfSuccess >= 33) {
      this.assessment = "Dangerous"
    } else {
      this.assessment = "Deadly"
    }
  }
}
