import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ApiService} from "../../services/api.service";
import {Base} from "../../models/base";
import {Inventory} from "../../models/inventory";
import {NotificationService} from "../../services/notification.service";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {InventoryItem} from "../../models/inventory-item";

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.scss'],
})
export class BaseModalComponent  implements OnInit {
  loading:boolean = true
  locationId!: string
  locationObject: undefined | Base
  inventory: Inventory | undefined
  inventoryView: 'inventory'|'storage' = 'inventory'
  user: User
  createLocation: boolean = false
  refreshMap!: Function

  constructor(private modalCtrl: ModalController, private api: ApiService, public notifications: NotificationService, public userService: UserService) {
    this.user = userService.activeUser!
  }

  async ngOnInit() {
    await this.loadInventories();
  }

  async loadInventories() {
    this.loading = true;
    await Promise.all([this.loadBase(), this.loadInventory()]);
    this.loading = false;
  }

  async loadBase(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = this.createLocation ? this.api.createBase() : this.api.getBase()
      request.subscribe({
        next : (data: Base) => {
          this.locationObject = data;
          if (this.createLocation) {
            this.refreshMap();
          }
          resolve();
        },
        error: error => reject(error)
      });
    });
  }

  async loadInventory(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.api.getInventory().subscribe({
        next: (data: Inventory) => {
          this.inventory = data;
          resolve();
        },
        error: error => reject(error)
      });
    });
  }

  moveItemToStorage(item: InventoryItem) {
    this.api.updateItem(item.id, { inventory_id: this.locationObject!.inventory.id }).subscribe({
      next: () => {
        this.loadInventories();
        this.notifications.presentToast(`Moved 1x ${item.name} to storage.`)
      }
    }).add(() => {
      // TODO: Prevent actions while transaction in progress?
    })
  }

  async pickUpItemFromStorage(item: InventoryItem) {
    this.api.updateItem(item.id, { inventory_id: this.inventory!.id }).subscribe({
      next: () => {
        this.loadInventories();
        this.notifications.presentToast(`Picked up 1x ${item.name} from storage.`)
      }
    }).add(() => {
      // TODO: Prevent actions while transaction in progress?
    })
  }

  returnToMap() {
    return this.modalCtrl.dismiss('cancel');
  }
}
