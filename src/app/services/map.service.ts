import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment as env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map: mapboxgl.Map | undefined;
  private mapMarkers: mapboxgl.Marker[] = [];
  private geolocateControl: mapboxgl.GeolocateControl | undefined;

  constructor() {
    (mapboxgl as any).accessToken = env.mapbox.accessToken;
  }

  initializeMap(containerId: string, center: [number, number], zoom: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.map = new mapboxgl.Map({
          container: containerId,
          style: env.mapbox.styleUrl,
          center: center,
          zoom: env.realmWalker.zoom,
          minZoom: env.realmWalker.minZoom,
          maxZoom: 17,
          // pitch: 40, # TODO: A user setting?
          attributionControl: false,
          interactive: true,
        });
        this.map.on('load', () => {
          this.addGeolocateControl().then(() => {
            this.startTrackingUser(); // Ensure tracking starts only after the control is added
            resolve(this.map);
          }).catch(reject);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  addMarker(latitude: number, longitude: number, element?: HTMLElement): void {
    if (!this.map) return;

    const marker = new mapboxgl.Marker({ element })
      .setLngLat([longitude, latitude])
      .addTo(this.map);
    this.mapMarkers.push(marker);
  }

  removeMarker(marker: mapboxgl.Marker): void {
    marker.remove();
    const index = this.mapMarkers.indexOf(marker);
    if (index > -1) {
      this.mapMarkers.splice(index, 1);
    }
  }

  clearAllMarkers(): void {
    this.mapMarkers.forEach(marker => marker.remove());
    this.mapMarkers = [];
  }

  resizeMap(): void {
    this.map?.resize();
  }

  async addGeolocateControl(): Promise<void> {
    if (this.map && !this.geolocateControl) {
      this.geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      });

      this.map.addControl(this.geolocateControl, 'bottom-right');
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for control to stabilize in the DOM

      this.geolocateControl.on('trackuserlocationstart', () => {
        this.disableMapInteraction();
      });

      this.geolocateControl.on('trackuserlocationend', () => {
        this.enableMapInteraction();
      });
    }
  }

  startTrackingUser(): void {
    if (this.geolocateControl && this.map) {
      this.geolocateControl.trigger();
    } else {
      console.warn('Geolocate control is not ready or map not initialized');
    }
  }

  disableMapInteraction(): void {
    if (this.map) {
      // this.map.dragPan.disable();
      // this.map.scrollZoom.disable();
      // this.map.doubleClickZoom.disable();
      // this.map.touchZoomRotate.disable();
      console.log('Map interactions disabled');
    }
  }

  enableMapInteraction(): void {
    if (this.map) {
      // this.map.dragPan.enable();
      // this.map.scrollZoom.enable();
      // this.map.doubleClickZoom.enable();
      // this.map.touchZoomRotate.enable();
      console.log('Map interactions enabled');
    }
  }
}
