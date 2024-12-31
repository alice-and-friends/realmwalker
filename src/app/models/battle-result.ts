import {LootContainer} from "./loot-container";

export interface BattleResult {
  battleResult: {
    userWon: boolean,
    userDied: boolean,
    monsterDied: boolean,
  }
  inventoryChanges: {
    inventoryLost: boolean | undefined,
    equipmentLost: boolean | undefined,
    amuletOfLossConsumed: boolean | undefined,
    amuletOfLifeConsumed: boolean | undefined,
    loot: LootContainer | undefined
  } | undefined
  xpLevelChange: {
    xpDiff: number,
    levelDiff: number,
    currentLevel: number,
  }
}
