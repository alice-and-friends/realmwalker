import { Injectable, NgZone } from '@angular/core';
import {Geolocation, PermissionStatus, Position, PositionOptions} from "@capacitor/geolocation";
import {Capacitor} from "@capacitor/core";

// TODO: Review doc https://v17.angular.io/guide/observables
@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private initialized = false
  private watcher: any
  public permissionsOK: boolean | undefined
  public permissionError: string | undefined
  public tracking: boolean = false;
  public latitude: any;
  public longitude: any;
  public location: Position | undefined;
  public positionOptions:PositionOptions = {
    enableHighAccuracy: true,
    // Note for future self: If you encounter a lot of issues with timeouts, try removing the two lines below (timeout and maximumAge)
    timeout: 10 * 1_000,
    maximumAge: 30 * 1_000,
  }

  constructor(public ngZone: NgZone) {}

  isOperational() {
    return !!this.latitude && !!this.longitude;
  }

  async init(): Promise<void> {
    if (this.initialized) return; // Prevent multiple initializations

    console.log('⏳ Initializing location service...');

    if (await this.permissionsGranted()) {
      console.debug('✅ Geolocation permissions OK')
      await this.trackUserLocation();
    }

    console.log('✅ Location service initialized!');
    this.initialized = true;
  }

  // public async init() {
  //   console.debug('Initializing Location Service')
  //   if (await this.permissionsGranted()) {
  //     console.debug('Geolocation permissions OK ✅')
  //     await this.trackUserLocation();
  //   }
  //   return this.isOperational();
  // }

  private async testPermissions() {
    console.debug('Testing location permissions...')
    try {
      const { coords } = await Geolocation.getCurrentPosition(this.positionOptions)
      this.latitude = coords.latitude;
      this.longitude = coords.longitude;
      this.permissionsOK = true;
      console.debug('Location permissions OK ✅')
    }
    catch(err: any) {
      this.permissionsOK = false;
      this.permissionError = err.message;
      console.error(err)
    }
  }

  public async permissionsGranted() {
    const test:PermissionStatus = await Geolocation.checkPermissions()
    return test.location === 'granted'
  }

  public async setup() {
    if (Capacitor.isNativePlatform()) {
      try {
        const test:PermissionStatus = await Geolocation.requestPermissions({ permissions: ['location'] })
        const granted = (test.location === 'granted')
        this.permissionsOK = granted
        return await this.trackUserLocation();
      }
      catch (err: any) {
        console.error(err)
        this.permissionsOK = false
        this.permissionError = err.message
        return false
      }
    }
    else {
      // Web setup
      return await this.trackUserLocation();
    }
  }

  public async requestPermissions() {
    try {
      if (Capacitor.isNativePlatform()) {
        const test:PermissionStatus = await Geolocation.requestPermissions({ permissions: ['location'] })
        const granted = (test.location === 'granted')
        this.permissionsOK = granted
        return granted
      } else {
        return await this.trackUserLocation();
      }
    }
    catch (err: any) {
      console.error(err)
      this.permissionsOK = false
      this.permissionError = err.message
      return false
    }
  }

  public async trackUserLocation() {
    await this.testPermissions()
    if (!this.permissionsOK) {
      console.error('Abort trackUserLocation, permissions do not check out')
      return
    }

    console.debug('Location service starting to track')
    try {
      this.watcher = Geolocation.watchPosition(
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
      this.tracking = true;
    }
    catch (err) {
      console.error(err)
    }
  }

  public stopTracking() {
    Geolocation.clearWatch({ id: this.watcher });
    this.tracking = false;
  }
}
