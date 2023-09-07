import {Component, OnInit} from '@angular/core';
import * as mapboxgl from "mapbox-gl";
import {Geolocation, Position} from "@capacitor/geolocation";
import {environment} from "../../environments/environment";
import {ActionSheetController, ModalController, ModalOptions} from "@ionic/angular";
import {ApiService} from "../services/api.service";
import {RealmLocation, LocationType} from "../models/realm-location";
import {Marker} from "mapbox-gl";
import {DungeonModalComponent} from "./dungeon-modal/dungeon-modal.component";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router"
import {CharacterModalComponent} from "./character-modal/character-modal.component";
import {AuthService} from "@auth0/auth0-angular";
import {NpcModalComponent} from "./npc-modal/npc-modal.component";
import {LocationService} from "../services/location.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  // General ui
  //presentingElement: any = null;
  modal: HTMLIonModalElement | undefined

  // Map config
  map: mapboxgl.Map | undefined;
  mapMarkers: Marker[] = []
  loadMarkers: any
  timer: any

  // Player input
  buildMenu = [
    {
      label: 'Build HQ', icon: 'star-sharp', f: () => {
        this.modalCtrl.dismiss().then(r => console.log(r));
        const coords = null //this.playerPosition!.coords;
        this.addMarker({
          'type': 'Feature',
          'properties': {
            'icon': 'star-sharp',
            'message': 'Foo'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [10, 10], //[location.lon, coords.latitude]
          }
        })
      }
    }
  ]

  constructor(
    public api: ApiService,
    public userService: UserService,
    private router: Router,
    public auth: AuthService,
    private readonly modalCtrl: ModalController,
    private readonly actionSheetCtrl: ActionSheetController,
    public location: LocationService,
  ) {
    if (!userService.loggedIn) {
      this.router.navigate(['/launch']);
      return;
    }
    this.modalCtrl = modalCtrl;
  }

  takeBuildAction = (opts: any) => {
    this.modalCtrl.dismiss().then(r => console.log(r));
    // opts.f();
  }

  async ngOnInit() {
    console.debug('Init home view. User location:', this.location.lat, this.location.lng);

    // Mapbox config
    (mapboxgl.accessToken as any) = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/alicecyan/clgs324md001m01qye8obgx8p',
      zoom: 12,
      maxZoom: 16,
      // minZoom: 8,
      center: [this.location.lng, this.location.lat],
      attributionControl: false,
      // pitch: 60
    });

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
    this.loadMarkers = () => {
      this.api.getLocations().subscribe((data: RealmLocation[]) => {
        this.mapMarkers.forEach((marker) => marker.remove())
        this.mapMarkers = []
        data.forEach(location => {
          this.addMarker(location);
        });
      })
    }
    this.loadMarkers();
    this.timer = setInterval(this.loadMarkers, 10 * 1000); // Refresh map every 10 seconds

    // Add map controls
    // this.map.addControl(new mapboxgl.NavigationControl());

    geolocate.on("error", () => {
      // Fallback solution taken from here: https://github.com/mapbox/mapbox-gl-js/issues/9680
      console.warn('geolocate failed, going with flyTo fallback')
      if (this.location.lat && this.location.lng) {
        // @ts-ignore
        this.map.flyTo(
          {
            center: [
              this.location.lng,
              this.location.lat
            ],
            zoom: 15,
            bearing: 0
          }
        );
      }
    });

    // this.map.on('load', () => {
    //   console.log('trigger geolocate', this.location.lat, this.location.lng)
    //   geolocate.trigger()
    // })
  }

  async openLocationModal(location: RealmLocation) {
    try {
      // @ts-ignore
      let modalOpts: ModalOptions = {
        componentProps: {
          locationType: location.type,
          locationId: location.id,
          modal: this.modal,
          openCharacterModal: await this.changeEquipmentForLocationFunc(location),
          refreshMap: this.loadMarkers,
        },
      }
      switch(location.type) {
        case LocationType.Dungeon:
          modalOpts = {
            ...modalOpts,
            component: DungeonModalComponent,
            breakpoints: [0, 0.60, 0.85],
            initialBreakpoint: 0.60,
          }
          break;
        // case LocationType.Battlefield:
        //   modalOpts = {
        //     ...modalOpts,
        //     component: BattlefieldModalComponent,
        //     breakpoints: [0, 0.60, 0.85],
        //     initialBreakpoint: 0.60,
        //   }
        //   break;
        case LocationType.Npc:
          modalOpts = {
            ...modalOpts,
            component: NpcModalComponent
          }
          break;
        default:
          throw(new Error(`Could not find matching modal controller for location type ${location.type}.`))
      }
      this.modal = await this.modalCtrl.create(modalOpts);
      await this.modal.present();
      /*
      addEventListener('ionBreakpointDidChange', (e: any) => {
        const breakpoint = e.detail.breakpoint;
        console.log('ionBreakpointDidChange', breakpoint)
      });
      */
    }
    catch (error) {
      console.error(error)
    }
  }

  async openCharacterModal(dismissCallback:any=null) {
    try {
      this.modal = await this.modalCtrl.create({
        component: CharacterModalComponent,
        componentProps: {
          dismissCallback: dismissCallback
        },
      });
      await this.modal.present();
    }
    catch (error) {
      console.error(error)
    }
  }
  changeEquipmentForLocationFunc(location: RealmLocation) {
    return async () => {
      if (this.modal) {
        await this.modalCtrl.dismiss();
      }
      await this.openCharacterModal(() => {
        this.openLocationModal(location)
      })
    }
  }

  addMarker(location: any) {
    if (this.map instanceof mapboxgl.Map) {
      // Create a DOM element for each marker.
      const el = document.createElement('div');
      const width = 26;
      const height = 26;
      el.className = 'marker';
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      switch(location.type) {
        case LocationType.Dungeon:
          el.className += ` dungeon monster-level-${location.dungeonDetails.level} monster-classification-${location.dungeonDetails.monsterClassification}`
          el.innerHTML = `<ion-icon
            src="/assets/icon/${location.dungeonDetails.monsterClassification}.svg"
            color="dark"
            slot="start"
            class="map-feature-icon"
            ></ion-icon>`;
          break;
        case LocationType.Battlefield:
          el.innerHTML = `<ion-icon src="/assets/icon/banner.svg" color="primary" slot="start" class="map-feature-icon"></ion-icon>`;
          break;
        case LocationType.Npc:
          switch(location.npcDetails.shopType) {
            case 'armorer':
              el.innerHTML = `<ion-icon src="/assets/icon/anvil.svg" color="medium" slot="start" class="map-feature-icon"></ion-icon>`;
              break;
            case 'jeweller':
              el.innerHTML = `<ion-icon src="/assets/icon/diamond.svg" color="primary" slot="start" class="map-feature-icon"></ion-icon>`;
              break;
            case 'magic':
              el.innerHTML = `<ion-icon src="/assets/icon/potion.svg" color="secondary" slot="start" class="map-feature-icon"></ion-icon>`;
              break;
            default:
              el.innerHTML = `<ion-icon name="chatbox-ellipses" color="dark" slot="start" class="map-feature-icon"></ion-icon>`;
          }
          if (location.npcDetails.spooked) {
            el.innerHTML += '<ion-icon src="/assets/icon/chatbox-exclamation-2.svg" color="dark" slot="start" class="map-feature-icon addon-icon">';
          }
          break;
        default:
          el.innerHTML = `<ion-icon name="Help" color="primary" slot="start" class="map-feature-icon"></ion-icon>`;
      }

      el.addEventListener('click', () => {
        this.openLocationModal(location)
      });

      // Add markers to the map.
      let marker = new mapboxgl.Marker(el)
        .setLngLat([location.coordinates.lat, location.coordinates.lon])
        .addTo(this.map);
      this.mapMarkers.push(marker)
    }
    else {
      console.error('this.map is not an instance of mapboxgl.Map')
    }
  }

  async presentLogoutActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Log out',
          handler: () => {
            this.auth.logout({ logoutParams: { returnTo: document.location.origin } })
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

}
