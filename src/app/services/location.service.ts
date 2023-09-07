import { Injectable, NgZone } from '@angular/core';
import {Geolocation, PermissionStatus, Position, PositionOptions} from "@capacitor/geolocation";
import {Capacitor} from "@capacitor/core";

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private wait: any
  public permissionError: boolean | undefined
  public lat: any;
  public lng: any;
  public location: Position | undefined;
  public positionOptions:PositionOptions = {
    enableHighAccuracy: true,
    // Note for future self: If you encounter a lot of issues with timeouts, try removing the two lines below (timeout and maximumAge)
    timeout: 10 * 1000,
    maximumAge: 30 * 1000,
  }

  constructor(public ngZone: NgZone) { }

  async init() {
    console.debug('Initializing Location Service')
    if (!await this.permissionsGranted()) {
      await this.requestPermissions()
    }
    await this.testPermissions();
    return !!this.lat && !!this.lng;
  }

  private async testPermissions() {
    console.debug('Testing location permissions...')
    try {
      const { coords } = await Geolocation.getCurrentPosition(this.positionOptions)
      this.lat = coords.latitude;
      this.lng = coords.longitude;
    }
    catch(err) {
      console.error(err)
      this.permissionError = true;
    }
  }

  public async permissionsGranted() {
    const test:PermissionStatus = await Geolocation.checkPermissions()
    return test.location === 'granted'
  }

  public async requestPermissions() {
    try {
      if (Capacitor.isNativePlatform()) {
        const test:PermissionStatus = await Geolocation.requestPermissions({ permissions: ['location'] })
        const granted = (test.location === 'granted')
        this.permissionError = !granted
        return granted
      }
      return true
    }
    catch (err) {
      console.error(err)
      this.permissionError = true
      return false
    }
  }

  public async track() {
    console.debug('Location service starting to track')
    try {
      this.wait = Geolocation.watchPosition(
        this.positionOptions,
        (position, err) => {
          if (err) {
            console.error(err)
            return
          }
          if (!position?.coords) {
            console.error('Position.coors is falsy', position)
            return
          }
          this.ngZone.run(() => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            console.info(`Position changed to ${this.lat}, ${this.lng}`)
          })
        }
      )
    }
    catch (err) {
      console.error(err)
      this.permissionError = true
    }
  }

  public stopTracking() {
    Geolocation.clearWatch({ id: this.wait });
  }
}
