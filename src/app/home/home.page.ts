import {Component, Injector, OnInit, ViewContainerRef} from '@angular/core';
import * as mapboxgl from "mapbox-gl";
import {environment} from "../../environments/environment";
import {ActionSheetController, ModalController, ModalOptions} from "@ionic/angular";
import {ApiService} from "../services/api.service";
import {RealmLocation, LocationType, LocationStatus} from "../models/realm-location";
import {Marker} from "mapbox-gl";
import {DungeonModalComponent} from "./dungeon-modal/dungeon-modal.component";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router"
import {CharacterModalComponent} from "./character-modal/character-modal.component";
import {AuthService} from "@auth0/auth0-angular";
import {NpcModalComponent} from "./npc-modal/npc-modal.component";
import {LocationService} from "../services/location.service";
import {BaseModalComponent} from "./base-modal/base-modal.component";
import {BattleResultModalComponent} from "./dungeon-modal/battle-result-modal/battle-result-modal.component";
import {ConstructionModalComponent} from "./construction-modal/construction-modal.component";
import {MapMarkerComponent} from "../components/map-marker/map-marker.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  // General ui
  presentingElement: any = null;
  modal: HTMLIonModalElement | undefined

  // Map config
  map: mapboxgl.Map | undefined;
  mapMarkers: Marker[] = []
  loadMarkers: any
  timer: any

  constructor(
    public api: ApiService,
    public userService: UserService,
    private router: Router,
    public auth: AuthService,
    private readonly modalCtrl: ModalController,
    private readonly actionSheetCtrl: ActionSheetController,
    public location: LocationService,

    // new
    private injector: Injector,
    private viewContainerRef: ViewContainerRef,
  ) {
    if (!userService.loggedIn) {
      this.router.navigate(['/launch']);
      return;
    }
    this.modalCtrl = modalCtrl;
  }

  async ngOnInit() {
    console.debug('Init home view. User location:', this.location.lat, this.location.lng);

    // Mapbox config
    (mapboxgl.accessToken as any) = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/alicecyan/clgs324md001m01qye8obgx8p',
      zoom: 12,
      maxZoom: 18,
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
    this.map.addControl(
      geolocate,
      'bottom-right'
    );
    this.map.on('load', () => {
      setTimeout(() => {
        console.log('trigger geolocate', this.location.lat, this.location.lng)
        geolocate.trigger()
      }, 1000)
    })

    // Add markers to the map.
    this.loadMarkers = () => {
      this.api.getLocations().subscribe((data: RealmLocation[]) => {
        this.mapMarkers.forEach((marker) => marker.remove())
        this.mapMarkers = []
        data.forEach(location => {
          this.addMarker(location);
        });
        console.debug('Load markers completed.')
      })
    }
    this.loadMarkers();
    if (environment.config.mapRefreshRate) {
      // Refresh map every n seconds
      this.timer = setInterval(this.loadMarkers, environment.config.mapRefreshRate * 1000);
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
  async openLocationModal(location: RealmLocation) {
    try {
      // @ts-ignore
      let modalOpts: ModalOptions = {
        componentProps: {
          modal: this.modal,
          refreshMap: this.loadMarkers,
          locationType: location.type,
          locationId: location.id,
          openCharacterModal: await this.changeEquipmentForLocationFunc(location),
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
        case LocationType.Npc:
          modalOpts = {
            ...modalOpts,
            component: NpcModalComponent,
          }
          break;
        case LocationType.Base:
          modalOpts = {
            ...modalOpts,
            component: BaseModalComponent,
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

  async openConstructionModal() {
    try {
      this.modal = await this.modalCtrl.create({
        component: ConstructionModalComponent,
        cssClass: 'floating-modal',
        showBackdrop: true,
        backdropDismiss: false,
        componentProps: {
          openBaseModal: async () => {
            await this.modalCtrl.dismiss();
            const modalOpts: ModalOptions = {
              component: BaseModalComponent,
              componentProps: {
                refreshMap: this.loadMarkers,
                createLocation: true, // This tells the modal controller that it needs to create a new base
              },
            }
            this.modal = await this.modalCtrl.create(modalOpts);
            await this.modal.present();
          }
        }
      });
      await this.modal.present();
    }
    catch (error) {
      console.error(error)
    }
  }

  async handleMarkerClick(location: RealmLocation) {
    await this.openLocationModal(location)
  }

  addMarker(location: any) {
    if (!(this.map instanceof mapboxgl.Map)) {
      throw('this.map is not an instance of mapboxgl.Map')
    }

    // Create the component instance
    const componentRef = this.viewContainerRef.createComponent(MapMarkerComponent, {injector: this.injector});
    componentRef.instance.location = location;
    componentRef.instance.onClick = this.handleMarkerClick.bind(this);;

    const domElem = (componentRef.location.nativeElement as HTMLElement);

    // Use this domElem as the element for the Mapbox marker
    let marker = new mapboxgl.Marker(domElem)
      .setLngLat([location.coordinates.lon, location.coordinates.lat])
      .addTo(this.map);
    this.mapMarkers.push(marker);
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
