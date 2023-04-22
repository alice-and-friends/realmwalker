import {Component, OnInit, ViewChild} from '@angular/core';
import * as mapboxgl from "mapbox-gl";
import {Geolocation, Position} from "@capacitor/geolocation";
import {environment} from "../../environments/environment";
import {IonModal, ModalController} from "@ionic/angular";
import {ApiService} from "../api.service";
import {RealmLocation, LocationType} from "../models/realm_location";
import {Marker} from "mapbox-gl";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  // General ui
  //presentingElement: any = null;
  modalBreakpointCheck(e: any) {
    if (e.detail.breakpoint == 0) {
      this.locationModalOpen = false;
    }
  }

  // Map config
  map: mapboxgl.Map | undefined;
  mapMarkers: Marker[] = []
  playerPosition: Position | undefined

  // Location
  locationModalOpen: boolean = false;
  inspectedLocation: RealmLocation | undefined;

  // Player input
  buildMenu = [
    {
      label: 'Build HQ', icon: 'star-sharp', f: () => {
        console.log('do the thing')
        this.modalCtrl.dismiss().then(r => console.log(r));
        const coords = this.playerPosition!.coords;
        this.addMarker({
          'type': 'Feature',
          'properties': {
            'icon': 'star-sharp',
            'message': 'Foo'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [coords.longitude, coords.latitude]
          }
        })
      }
    }
  ]

  constructor(public api: ApiService, private modalCtrl: ModalController) {
    console.log('home construct')
    this.modalCtrl = modalCtrl;
  }

  takeBuildAction = (opts: any) => {
    console.log(this.modalCtrl)
    this.modalCtrl.dismiss().then(r => console.log(r));
    // opts.f();
  }

  async ngOnInit() {
    console.log('home init')
    // Something to do with modals
    // this.presentingElement = document.querySelector('.ion-page');

    // Player info
    this.playerPosition = await Geolocation.getCurrentPosition();
    console.log('You are here:', this.playerPosition);

    // Mapbox config

    (mapboxgl.accessToken as any) = environment.mapbox.accessToken;

    console.log('Your access token:', mapboxgl.accessToken);
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/alicecyan/clgs324md001m01qye8obgx8p',
      zoom: 1,
      maxZoom: 16,
      // minZoom: 12,
      // center: [this.playerPosition.coords.longitude, this.playerPosition.coords.latitude],
      attributionControl: false,
      // pitch: 60
    });
    console.log('Your map:', this.map);

    // Navigation controls
    // this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right'); // position is optional

    // Add geolocate control to the map.
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      fitBoundsOptions: {
        maxZoom: 16
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
    });
    this.map.addControl(
      geolocate,
      'bottom-right'
    );

    // Add markers to the map.
    this.loadMarkers();

    // Add map controls
    // this.map.addControl(new mapboxgl.NavigationControl());

    geolocate.on("error", () => {
      // Fallback solution taken from here: https://github.com/mapbox/mapbox-gl-js/issues/9680
      console.warn('geolocate failed, going with flyTo fallback')
      if (this.playerPosition) {
        // @ts-ignore
        this.map.flyTo(
          {
            center: [
              this.playerPosition.coords.longitude,
              this.playerPosition.coords.latitude
            ],
            zoom: 15,
            bearing: 0
          }
        );
      }
    });

    this.map.on('load', () => {
      console.log('trigger geolocate')
      geolocate.trigger()
    })
  }

  loadMarkers() {
    this.api.getLocations().subscribe((data: RealmLocation[]) => {
      this.mapMarkers.forEach((marker) => marker.remove())
      this.mapMarkers = []
      data.forEach(location => {
        this.addMarker(location);
      });
    })
  }

  async inspectLocation(el: HTMLDivElement, location: RealmLocation) {
    this.inspectedLocation = location;
    this.locationModalOpen = true
  }

  battle() {
    this.api.battle(this.inspectedLocation!.id).subscribe((result: any) => {
      if (result.defeated) {
        alert('Victory!')
        if (this.inspectedLocation) {
          // this.inspectedLocation.setAsDefeated();
        }
        this.loadMarkers();
      }
    })
  }

  addMarker(location: any) {
    if (this.map instanceof mapboxgl.Map) {
      // Create a DOM element for each marker.
      const el = document.createElement('div');
      const width = 32;
      const height = 32;
      el.className = 'marker';
      //el.style.backgroundImage = `url(https://placekitten.com/g/${width}/${height}/)`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      //el.style.backgroundSize = '100%';
      el.innerHTML = `<ion-icon name="${location.icon}" color="primary" slot="start" class="map-feature-icon"></ion-icon>`;

      el.addEventListener('click', () => {
        this.inspectLocation(el, location)
      });

      // Add markers to the map.
      let marker = new mapboxgl.Marker(el)
        .setLngLat(location.coordinates as any)
        .addTo(this.map);
      this.mapMarkers.push(marker)
    }
    else {
      console.error('this.map is not an instance of mapboxgl.Map')
    }
  }

}
