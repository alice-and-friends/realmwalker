import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ApiService} from "../../../../services/api.service";
import {Base} from "../../../../models/base";
import {Inventory} from "../../../../models/inventory";
import {NotificationService} from "../../../../services/notification.service";
import {UserService} from "../../../../services/user.service";
import {User} from "../../../../models/user";
import {InventoryItem} from "../../../../models/inventory-item";
import {AbstractLocationModalComponent} from "../location-modal.component";

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.scss'],
})
export class BaseModalComponent extends AbstractLocationModalComponent implements OnInit {
  inventory: Inventory | undefined
  inventoryView: 'inventory'|'storage' = 'inventory'
  user: User
  createLocation: boolean = false

  constructor(
    protected override modalCtrl: ModalController,
    protected override api: ApiService,
    public override notifications: NotificationService,
    public userService: UserService,
  ) {
    super(modalCtrl, api, notifications)
    this.user = userService.activeUser!
  }

  async loadData() {
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
            this.userService.refresh()
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
        this.loadData();
        this.notifications.presentToast(`Moved 1x ${item.name} to storage.`)
      }
    }).add(() => {
      // TODO: Prevent actions while transaction in progress?
    })
  }

  async pickUpItemFromStorage(item: InventoryItem) {
    this.api.updateItem(item.id, { inventory_id: this.inventory!.id }).subscribe({
      next: () => {
        this.loadData();
        this.notifications.presentToast(`Picked up 1x ${item.name} from storage.`)
      }
    }).add(() => {
      // TODO: Prevent actions while transaction in progress?
    })
  }
}
