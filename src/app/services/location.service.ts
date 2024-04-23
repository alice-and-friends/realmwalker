import { Injectable, NgZone } from '@angular/core';
import {Geolocation, PermissionStatus, Position, PositionOptions} from "@capacitor/geolocation";
import {Capacitor} from "@capacitor/core";

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private wait: any
  public permissionError: boolean | undefined
  public latitude: any;
  public longitude: any;
  public location: Position | undefined;
  public positionOptions:PositionOptions = {
    enableHighAccuracy: true,
    // Note for future self: If you encounter a lot of issues with timeouts, try removing the two lines below (timeout and maximumAge)
    timeout: 10 * 1_000,
    maximumAge: 30 * 1_000,
  }

  constructor(public ngZone: NgZone) { }

  async init() {
    console.debug('Initializing Location Service')
    if (!await this.permissionsGranted()) {
      await this.requestPermissions()
    }
    await this.testPermissions();
    return !!this.latitude && !!this.longitude;
  }

  private async testPermissions() {
    console.debug('Testing location permissions...')
    try {
      const { coords } = await Geolocation.getCurrentPosition(this.positionOptions)
      this.latitude = coords.latitude;
      this.longitude = coords.longitude;
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
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            console.debug(`Position changed to ${this.latitude}, ${this.longitude}`)
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
