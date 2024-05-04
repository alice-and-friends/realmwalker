import {Component, Input, OnInit} from '@angular/core';
import {LocationStatus, LocationType, RealmLocation} from "../../models/realm-location";
import {ShopType} from "../../models/npc";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-map-marker',
  templateUrl: './map-marker.component.html',
  styleUrls: ['./map-marker.component.scss'],
})
export class MapMarkerComponent  implements OnInit {
  @Input() location!: RealmLocation;
  @Input() onClick?: (location: RealmLocation) => void;
  @Input() removeMarker!: Function
  private timeoutId: any;
  iconSize = 0
  dynamicSvg: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer, public userService: UserService) {}

  handleClick(): void {
    if (this.onClick) {
      this.onClick(this.location);
    }
  }

  getDigit(): any {
    if (this.location.status === LocationStatus.Active && this.userService.activeUser?.preferences?.dungeonLevels) {
      return this.location.level;
    }
  }

  getIconSrc(): string {
    const dir: string = '/assets/icon';

    // Separate function for monster name transformation
    const getCleanMonsterName = (name: string): string => {
      return name
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
    };

    switch (this.location.type) {
      case LocationType.Base:
        return `${dir}/location/base.svg`;
      case LocationType.Castle:
        return `${dir}/location/castle.svg`;
      case LocationType.Dungeon:
        if (this.location.status === LocationStatus.Defeated) {
          return `${dir}/banner.svg`;
        }
        const cleanMonsterName = getCleanMonsterName(this.location.name);
        return `${dir}/monster/${cleanMonsterName}.svg`;
      case LocationType.LeyLine:
        return `${dir}/location/ley-line.svg`;
      case LocationType.Npc:
        const shopType = this.location.npcDetails!.shopType!;
        if (Object.values(ShopType).includes(shopType)) {
          return `${dir}/location/${shopType.toLowerCase()}.svg`;
        }
        break; // Break here if shopType doesn't match known types
      case LocationType.Runestone:
        return `${dir}/location/runestone.svg`;
    }

    console.warn(`Unknown location type: ${this.location.type}`);
    return `${dir}/location/position-marker.svg`;
  }

  getIconSize(): number {
    let defaultSize = 26

    switch (this.location.type) {
      case LocationType.Base:
        return defaultSize + 10;
      case LocationType.Npc:
        if (this.location.npcDetails?.shopType === ShopType.Castle) {
          return defaultSize + 10;
        }
        else {
          return defaultSize;
        }
      case LocationType.Dungeon:
        const dungeonLevel = this.location.level!
        if (dungeonLevel == 10) {
          return 100
        }
        else if (dungeonLevel == 9) {
          return defaultSize + 15
        }
        else if (dungeonLevel >= 9) {
          return defaultSize + 7
        }
        else {
          return defaultSize + 2
        }
      case LocationType.LeyLine:
        return 40;
      case LocationType.Runestone:
        return defaultSize + 5
    }

    return defaultSize;
  }

  getIconColor(): string {
    switch (this.location.type) {
      case LocationType.Base:
        return '#ffffff'
      case LocationType.Dungeon:
        if (this.location.status === LocationStatus.Defeated) {
          return '#3880ff'
        }
        return '#A5292A'
      case LocationType.LeyLine:
        return ''
      case LocationType.Npc:
        const shopType = this.location.npcDetails!.shopType!;
        switch (shopType) {
          case ShopType.Armorer:
            return '#989aa2'
          case ShopType.Castle:
            return '#3880ff'
          case ShopType.Jeweller:
            return '#3880ff'
          case ShopType.Magic:
            return '#50c8ff'
        }
        break; // Break here if shopType doesn't match known types
      case LocationType.Runestone:
        return '#666666'
    }

    // Default color
    return '#ffffff'
  }

  getMarkerClass(): string {
    return `marker location-type-${this.location.type.toLowerCase()}`
  }

  fetchSvgAndSetColor(svgUrl: string, fillColor: string): void {
    fetch(svgUrl)
      .then(response => response.text())
      .then(svgText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = doc.querySelector('svg');
        if (svgElement) {
          if (fillColor) {
            svgElement.querySelectorAll('path').forEach(path => {
              if (!path.getAttribute('fill')) { // Only set fill color if it's not already set
                path.setAttribute('fill', fillColor);
              }
            });
          }
          const serializer = new XMLSerializer();
          const serializedSvg = serializer.serializeToString(svgElement);
          // Bypass sanitization
          this.dynamicSvg = this.sanitizer.bypassSecurityTrustHtml(serializedSvg);
        }
      });
  }

  setupExpirationTimer(): void {
    if (!this.location.expiresAt) {
      throw('this.location.expiresAt is not a Date')
    }

    const now = new Date();
    const expiresAt = this.location.expiresAt;
    const timeUntilExpiration = expiresAt.getTime() - now.getTime();

    if (timeUntilExpiration > 0) {
      this.timeoutId = setTimeout(() => {
        if (this.removeMarker) {
          console.log('remove marker (timed)')
          this.removeMarker();
        }
      }, timeUntilExpiration);
    } else {
      // If already expired, remove immediately
      if (this.removeMarker) {
        console.log('remove marker (immediate)')
        this.removeMarker();
      }
    }
  }

  ngOnInit() {
    if (this.location.expiresAt) {
      this.setupExpirationTimer();
    }
    this.iconSize = this.getIconSize()
    this.fetchSvgAndSetColor(this.getIconSrc(), this.getIconColor())
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
