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
    loot: {
      gold: number,
      items: any
    } | undefined
  } | undefined
  xpLevelChange: {
    xpDiff: number,
    levelDiff: number,
    currentLevel: number,
  }
}
