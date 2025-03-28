import {Component, Input, OnInit} from '@angular/core';
import {LocationStatus, LocationType, RealmLocation} from "../../models/realm-location";
import {ShopType} from "../../models/npc";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {UserService} from "../../services/user.service";
import {RenewableType} from "../../models/renewable";

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
      case LocationType.Dungeon:
        if (this.location.status === LocationStatus.Defeated) {
          return `${dir}/location/battle-site.svg`;
        }
        const cleanMonsterName = getCleanMonsterName(this.location.name);
        return `${dir}/monster/${cleanMonsterName}.svg`;
      case LocationType.LeyLine:
        return `${dir}/location/ley-line.svg`;
      case LocationType.Npc:
        const shopType: ShopType = this.location.shopType!;
        if (Object.values(ShopType).includes(shopType)) {
          if (shopType == ShopType.Alchemist) return `${dir}/location/observatory.svg`;
          if (shopType == ShopType.Druid) return `${dir}/location/treehouse.svg`;
          return `${dir}/location/${shopType}.svg`;
        }
        break; // Break here if shopType doesn't match known types
      case LocationType.Renewable:
        const renewableType: RenewableType = this.location.renewableType!;
        if (Object.values(RenewableType).includes(renewableType)) {
          if (renewableType == RenewableType.Mine) return `${dir}/location/mine.svg`;
          if (renewableType == RenewableType.FlowerForest) return `${dir}/location/flower_forest.svg`;
          return `${dir}/location/${renewableType}.svg`;
        }
        break; // Break here if renewableType doesn't match known types
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
        if (this.location.shopType === ShopType.Alchemist) {
          return defaultSize + 6;
        }
        if (this.location.shopType === ShopType.Castle) {
          return defaultSize + 10;
        }
        if (this.location.shopType === ShopType.Druid) {
          return defaultSize + 11;
        }
        else {
          return defaultSize;
        }
      case LocationType.Dungeon:
        const dungeonLevel = this.location.level!
        if (dungeonLevel >= 90) {
          return 100
        }
        else if (dungeonLevel >= 80) {
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
      case LocationType.Renewable:
        if (this.location.renewableType === RenewableType.Mine) {
          return defaultSize + 6;
        }
        else {
          return defaultSize + 4
        }
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
        const shopType = this.location.shopType!;
        switch (shopType) {
          case ShopType.Armorer:
            return '#989aa2'
          case ShopType.Castle:
            return '#3880ff'
          case ShopType.Equipment:
            return '#79655d'
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
