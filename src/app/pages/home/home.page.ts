import {Component, Injector, OnDestroy, OnInit, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import * as mapboxgl from "mapbox-gl";
import {Marker} from "mapbox-gl";
import {environment as env} from "../../../environments/environment";
import {ApiService} from "../../services/api.service";
import {LocationStatus, LocationType, RealmLocation} from "../../models/realm-location";
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
import {closeDrawerAnimation, openDrawerAnimation} from '../../animations/drawer.animation';
import {LeyLineModalComponent} from "./location-modal/ley-line-modal/ley-line-modal.component";
import {JournalModalComponent} from "./journal-modal/journal-modal.component";
import {RealmEvent} from "../../models/realm-event";
import {AnalyticsService} from "../../services/analytics.service";
import {ModalOptions} from "@ionic/angular";
import {ModalService} from "../../services/modal.service";
import {MapService} from "../../services/map.service";
import {RenewableModalComponent} from "./location-modal/renewable-modal/renewable-modal.component";
import {SoundAsset} from "../../services/sound.service";
import {BattleSiteModalComponent} from "./location-modal/battle-site-modal/battle-site-modal.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePage implements OnInit, OnDestroy {
  // General ui
  presentingElement: any = null;
  modal: HTMLIonModalElement | undefined
  SoundAsset = SoundAsset;

  // Map
  map: mapboxgl.Map | undefined;
  mapMarkers: Marker[] = []
  // loadRealmData: any
  timer: any

  // Realm data
  activeEvents: RealmEvent[] = []
  locations: RealmLocation[] = []

  constructor(
    public api: ApiService,
    public auth: AuthService,
    public location: LocationService,
    public mapService: MapService,
    public userService: UserService,
    private router: Router,
    private analytics: AnalyticsService,
    private injector: Injector,
    private modalService: ModalService,
    private viewContainerRef: ViewContainerRef,
  ) {
    if (!userService.loggedIn) {
      console.error('Not logged in error on home page')
      // void this.router.navigate(['/main-menu']); // TODO: Maybe handle this in a router guard or something like that
      return;
    }
  }

  mapAvailable(): boolean {
    return this.map instanceof mapboxgl.Map
  }

  applyMarkers() {
    if (!this.mapAvailable()) return;

    this.mapService.clearAllMarkers();
    this.locations.forEach((location: RealmLocation) => {
      this.addMarker(location);
    });
    console.debug('Load markers completed.')
  }

  loadRealmData() {
    this.api.home().subscribe((data: any) => {
      this.activeEvents = data.events.active;
      this.locations = data.locations

      if (this.mapAvailable()) {
        this.applyMarkers();
      }
    })
  }

  ngOnInit() {
    console.debug('Init home view. User location:', this.location.latitude, this.location.longitude);

    this.loadRealmData();

    let userLocation: [number, number] = [this.location.longitude, this.location.latitude]
    this.mapService.initializeMap('mapContainer', userLocation, 10).then((map: any) => {
      this.map = map;
      console.log('Map is fully loaded');

      this.applyMarkers();

      if (env.realmWalker.mapRefreshRate) {
        // Refresh map every n seconds
        this.timer = setInterval(this.loadRealmData.bind(this), env.realmWalker.mapRefreshRate * 1_000);
      }

    }).catch(error => {
      console.error('Error initializing map:', error);
    });
  }

  ngOnDestroy(): void {
    this.mapService.clearAllMarkers(); // Clean up markers when component is destroyed
  }

  /*
  initializeMap() {
    // Mapbox config
    (mapboxgl.accessToken as any) = env.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: env.mapbox.styleUrl,
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
  */

  async openLocationModal(location: RealmLocation) {
    this.analytics.events.viewLocation({location: location})

    const modalComponentMap: { [key in LocationType]?: any } = {
      [LocationType.Base]: BaseModalComponent,
      [LocationType.Dungeon]: (() => {
        switch(location.status) {
          case LocationStatus.Active:
            return DungeonModalComponent;
          case LocationStatus.Defeated:
            return BattleSiteModalComponent;
          default:
            return false;
        }
      })(),
      [LocationType.LeyLine]: LeyLineModalComponent,
      [LocationType.Npc]: NpcModalComponent,
      [LocationType.Renewable]: RenewableModalComponent,
      [LocationType.Runestone]: RunestoneModalComponent,
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
        refreshMap: () => this.loadRealmData(),
        locationId: location.id,
        changeEquipment: async () => {
          if (this.modal) {
            await this.modalService.dismiss();
          }
          await this.openCharacterModal(() => {
            this.openLocationModal(location)
          })
        },
        openInventory: async () => {
          await this.modalService.dismissAll();
          await this.openInventoryModal();
        },
      },
    }

    if (location.type === LocationType.Dungeon) {
      modalOpts = { ...modalOpts, breakpoints: [0, 0.60, 0.85], initialBreakpoint: 0.60 };
    }

    if (location.type === LocationType.LeyLine) {
      modalOpts = { ...modalOpts, breakpoints: [0, 0.60, 0.85], initialBreakpoint: 0.60 };
    }

    this.modal = await this.modalService.new(modalOpts);
    await this.modal.present();
  }

  async openInventoryModal() {
    await this.openCharacterModal()
  }

  async openJournalModal() {
    this.modal = await this.modalService.new({ component: JournalModalComponent });
    await this.modal.present();
  }

  async openCharacterModal(dismissCallback:any=null) {
    this.modal = await this.modalService.new({
      component: CharacterModalComponent,
      componentProps: {
        dismissCallback: dismissCallback
      },
    });
    await this.modal.present();
  }

  async openConstructionModal() {
    this.modal = await this.modalService.new({
      component: ConstructionModalComponent,
      cssClass: 'floating-modal',
      showBackdrop: true,
      backdropDismiss: false,
      componentProps: {
        openBaseModal: async () => {
          await this.modal?.dismiss();
          const modalOpts: ModalOptions = {
            component: BaseModalComponent,
            componentProps: {
              refreshMap: this.loadRealmData,
              createLocation: true, // This tells the modal controller that it needs to create a new base
            },
          }
          this.modal = await this.modalService.new(modalOpts);
          await this.modal.present();
        }
      }
    });
    await this.modal.present();
  }

  async handleMarkerClick(location: RealmLocation) {
    await this.openLocationModal(location)
  }

  addMarker(location: any) {
    if (!this.mapAvailable()) {
      throw('this.map is not an instance of mapboxgl.Map')
    }

    // Create the component instance
    const componentRef = this.viewContainerRef.createComponent(MapMarkerComponent, {injector: this.injector});
    componentRef.instance.location = location;
    componentRef.instance.onClick = this.handleMarkerClick.bind(this);

    const domElement = (componentRef.location.nativeElement as HTMLElement);

    this.mapService.addMarker(location.coordinates.latitude, location.coordinates.longitude, domElement)
  }

  async openSettings() {
    this.modal = await this.modalService.new({
      component: SettingsPage,
      cssClass: 'settings-drawer-modal',
      enterAnimation: openDrawerAnimation,
      leaveAnimation: closeDrawerAnimation,
    });
    await this.modal.present();
  }
}
