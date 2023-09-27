export interface User {
  id: number;
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
}
