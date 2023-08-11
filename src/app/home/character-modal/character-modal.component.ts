import { Component, OnInit } from '@angular/core';
import {AlertController, IonicSafeString, ModalController} from "@ionic/angular";
import {ApiService} from "../../services/api.service";
import {AuthService} from "@auth0/auth0-angular";
import {InventoryItem} from "../../models/inventory-item";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";

@Component({
  selector: 'app-character-modal',
  templateUrl: './character-modal.component.html',
  styleUrls: ['./character-modal.component.scss'],
})
export class CharacterModalComponent  implements OnInit {
  inventory: InventoryItem[] | undefined;
  user: User | undefined;

  constructor(
    private modalCtrl: ModalController,
    private alertController:AlertController,
    private api: ApiService,
    public auth: AuthService,
    public userService: UserService
  ) {
    this.user = userService.activeUser
  }

  ngOnInit() {
    this.api.getInventory().subscribe((data: any) => {
      this.inventory = data;
    })
  }

  toggleEquipped(item: InventoryItem) {
    const desiredState = !item.isEquipped
    item.isEquipped = desiredState; // Optimistic update
    this.api.setEquipped(item.id, desiredState).subscribe(
      async (response: any) => {
        if (desiredState && !response.equipped && response.unequipItems.length) {
          await this.confirmEquipmentChange(
            response.unequipItems.map((a:any) => a['name']),
            () => {
              this.api.setEquipped(item.id, desiredState, true).subscribe(
                async (response: any) => {
                  this.inventory = response.inventory;
                },
                error => {
                  item.isEquipped = !desiredState; // Undo optimistic change
                  console.error(error)
                },
              );
            },
            () => {
              item.isEquipped = !desiredState; // Undo optimistic change
            }
          )
        }
      },
      error => {
        item.isEquipped = !desiredState; // Undo optimistic change
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
    return this.modalCtrl.dismiss('cancel');
  }

  protected readonly document = document;
}
