export class Coordinates {
  lon: number
  lat: number

  constructor(data: {lon: number, lat: number}) {
    this.lat = data.lat
    this.lon = data.lon
  }
}
