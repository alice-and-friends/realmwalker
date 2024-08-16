export interface UserPreferences {
  sound: boolean,
  music: boolean,
  developer: boolean,
  itemFrames: string,
  dungeonLevels: boolean,
}
export interface User {
  id: string;
  email: string;
  name: string;
  base: null|object;
  xpLevelReport: {
    xp: number,
    level: number,
    nextLevelAt: number,
    toNextLevel: number,
    nextLevelProgress: number,
  };
  preferences: UserPreferences,
}
