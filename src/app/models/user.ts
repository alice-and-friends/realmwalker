export interface User {
  id: number;
  email: string;
  givenName: string;
  familyName: string;
  xpLevelReport: {
    xp: number,
    level: number,
    nextLevelAt: number,
    toNextLevel: number,
    nextLevelProgress: number,
  };
}
