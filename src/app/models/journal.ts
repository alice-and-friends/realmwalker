export class Journal {
  runestones: {
    discoveredCount: number
    undiscoveredCount: number
    discoveredRunestones: any[]
  };

  constructor(data: any) {
    this.runestones = data.runestones
  }
}
