import {Component, Injector, OnInit, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import * as mapboxgl from "mapbox-gl";
import {environment as env} from "../../../environments/environment";
import {ActionSheetController, ModalController, ModalOptions} from "@ionic/angular";
import {ApiService} from "../../services/api.service";
import {RealmLocation, LocationType} from "../../models/realm-location";
import {Marker} from "mapbox-gl";
import {DungeonModalComponent} from "./location-modal/dungeon-modal/dungeon-modal.component";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router"
import {CharacterModalComponent} from "./character-modal/character-modal.component";
import {AuthService} from "@auth0/auth0-angular";
import {NpcModalComponent} from "./location-modal/npc-modal/npc-modal.component";
import {LocationService} from "../../services/location.service";
import {BaseModalComponent} from "./location-modal/base-modal/base-modal.component";
import {ConstructionModalComponent} from "./construction-modal/construction-modal.component";
import {MapMarkerComponent} from "../../components/map-marker/map-marker.component";
import {RunestoneModalComponent} from "./location-modal/runestone-modal/runestone-modal.component";
import {SettingsPage} from "../settings/settings.page";
import { openDrawerAnimation, closeDrawerAnimation } from '../../animations/drawer.animation';
import {LeyLineModalComponent} from "./location-modal/ley-line-modal/ley-line-modal.component";
import {JournalModalComponent} from "./journal-modal/journal-modal.component";
import {RealmEvent} from "../../models/realm-event";
import {AnalyticsService} from "../../services/analytics.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePage implements OnInit {
  // General ui
  presentingElement: any = null;
  modal: HTMLIonModalElement | undefined

  // Map
  map: mapboxgl.Map | undefined;
  mapMarkers: Marker[] = []
  loadRealmData: any
  timer: any

  // Events
  activeEvents: RealmEvent[] = []

  constructor(
    private analytics: AnalyticsService,
    public api: ApiService,
    public userService: UserService,
    private router: Router,
    public auth: AuthService,
    private readonly modalCtrl: ModalController,
    private readonly actionSheetCtrl: ActionSheetController,
    public location: LocationService,
    private injector: Injector,
    private viewContainerRef: ViewContainerRef,
  ) {
    if (!userService.loggedIn) {
      this.router.navigate(['/launch']); // TODO: Maybe handle this in a router guard or something like that
      return;
    }
    this.modalCtrl = modalCtrl;
  }

  ngOnInit() {
    console.debug('Init home view. User location:', this.location.latitude, this.location.longitude);
    this.initializeMap()
  }

  initializeMap() {
    // Mapbox config
    (mapboxgl.accessToken as any) = env.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/alicecyan/clgs324md001m01qye8obgx8p',
      zoom: 12,
      maxZoom: 18,
      // minZoom: 8,
      center: [this.location.longitude, this.location.latitude],
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
      if (this.location.latitude && this.location.longitude) {
        // @ts-ignore
        this.map.flyTo(
          {
            center: [
              this.location.longitude,
              this.location.latitude
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
        console.log('trigger geolocate', this.location.latitude, this.location.longitude)
        geolocate.trigger()
      }, 1000)
    })

    // Add markers to the map.
    this.loadRealmData = () => {
      this.api.home().subscribe((data: any) => {
        // Events
        this.activeEvents = data.events.active;

        // Map
        this.mapMarkers.forEach((marker) => marker.remove())
        this.mapMarkers = []
        data.locations.forEach((location: RealmLocation) => {
          this.addMarker(location);
        });
        console.debug('Load markers completed.')
      })
    }
    this.loadRealmData();
    if (env.realmWalker.mapRefreshRate) {
      // Refresh map every n seconds
      this.timer = setInterval(this.loadRealmData, env.realmWalker.mapRefreshRate * 1_000);
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
    this.analytics.events.viewLocation({location: location})

    try {
      const modalComponentMap: { [key in LocationType]?: any } = {
        [LocationType.Dungeon]: DungeonModalComponent,
        [LocationType.Npc]: NpcModalComponent,
        [LocationType.Base]: BaseModalComponent,
        [LocationType.Runestone]: RunestoneModalComponent,
        [LocationType.LeyLine]: LeyLineModalComponent,
        // Extend with other mappings as necessary
      };

      const component = modalComponentMap[location.type];
      if (!component) {
        throw new Error(`No modal component mapped for location type: ${location.type}`);
      }

      let modalOpts: ModalOptions = {
        component: component,
        componentProps: {
          modal: this.modal,
          refreshMap: this.loadRealmData,
          locationId: location.id,
          openCharacterModal: this.changeEquipmentForLocationFunc(location),
        },
      }

      if (location.type === LocationType.Dungeon) {
        modalOpts = { ...modalOpts, breakpoints: [0, 0.60, 0.85], initialBreakpoint: 0.60 };
      }

      if (location.type === LocationType.LeyLine) {
        modalOpts = { ...modalOpts, breakpoints: [0, 0.60, 0.85], initialBreakpoint: 0.60 };
      }

      this.modal = await this.modalCtrl.create(modalOpts);
      await this.modal.present();
    } catch (error) {
      console.error(error);
      // TODO: display error feedback to the user
    }
  }

  async openInventoryModal() {
    await this.openCharacterModal()
  }

  async openJournalModal() {
    try {
      this.modal = await this.modalCtrl.create({
        component: JournalModalComponent,
      });
      await this.modal.present();
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
                refreshMap: this.loadRealmData,
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
    componentRef.instance.onClick = this.handleMarkerClick.bind(this);

    const domElem = (componentRef.location.nativeElement as HTMLElement);

    // Use this domElem as the element for the Mapbox marker
    let marker = new mapboxgl.Marker(domElem)
      .setLngLat([location.coordinates.longitude, location.coordinates.latitude])
      .addTo(this.map);

    // Pass a function to the component that allows it to destroy the marker
    componentRef.instance.removeMarker = marker.remove.bind(marker);

    this.mapMarkers.push(marker);
  }

  async openSettings() {
    this.modal = await this.modalCtrl.create({
      component: SettingsPage,
      cssClass: 'settings-drawer-modal',
      enterAnimation: openDrawerAnimation,
      leaveAnimation: closeDrawerAnimation,
    });
    return await this.modal.present();
  }
}
