import { Component, OnInit } from '@angular/core';
import {AlertController, IonicSafeString} from "@ionic/angular";
import {ApiService} from "../../../services/api.service";
import {InventoryItem} from "../../../models/inventory-item";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user";
import {Inventory} from "../../../models/inventory";
import {ModalService} from "../../../services/modal.service";

@Component({
  selector: 'app-character-modal',
  templateUrl: './character-modal.component.html',
  styleUrls: ['./character-modal.component.scss'],
})
export class CharacterModalComponent  implements OnInit {
  inventoryItems: InventoryItem[] | undefined
  gold: number | undefined
  user: User | undefined
  dismissCallback: any

  constructor(
    private modalService: ModalService,
    private alertController:AlertController,
    private api: ApiService,
    public userService: UserService
  ) {
    this.user = userService.activeUser
  }

  ngOnInit() {
    this.api.getInventory().subscribe((data: any) => {
      this.setInventory(data)
    })
  }

  setInventory(inventory: Inventory) {
    this.gold = inventory.gold
    this.inventoryItems = inventory.items
  }

  toggleEquipped(item: InventoryItem) {
    const desiredState = !item.equipped
    item.equipped = desiredState; // Optimistic update
    this.api.setEquipped(item.id, desiredState).subscribe(
      async (response: any) => {
        if (desiredState && !response.equipped && response.unequipItems.length) {
          await this.confirmEquipmentChange(
            response.unequipItems.map((a:any) => a['name']),
            () => {
              this.api.setEquipped(item.id, desiredState, true).subscribe(
                async (response: any) => {
                  this.setInventory(response.inventory)
                },
                error => {
                  item.equipped = !desiredState; // Undo optimistic change
                  console.error(error)
                },
              );
            },
            () => {
              item.equipped = !desiredState; // Undo optimistic change
            }
          )
        }
      },
      error => {
        item.equipped = !desiredState; // Undo optimistic change
        console.error(error)
      },
    );
  }

  async confirmEquipmentChange(itemsToBeUnequipped: string[], callback: any, cancelCallback: any) {
    let message = '<p>These items will be unequipped:</p>'
    for (let item of itemsToBeUnequipped) {
      message += `• ${item}<br>`
    }
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: new IonicSafeString(message),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (blah) => {
            cancelCallback()
            return false;
          }
        }, {
          text: 'Okay',
          handler: () => {
            callback();
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  cancel() {
    this.modalService.dismiss().then((r: any) => {
      if (this.dismissCallback) this.dismissCallback()
    });
  }
}
