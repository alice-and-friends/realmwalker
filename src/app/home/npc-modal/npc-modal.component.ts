import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ApiService} from "../../services/api.service";
import {Npc} from "../../models/npc";
import {Inventory} from "../../models/inventory";
import {TradeOffer} from "../../models/trade-offer";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-npc-modal',
  templateUrl: './npc-modal.component.html',
  styleUrls: ['./npc-modal.component.scss'],
})
export class NpcModalComponent  implements OnInit {
  loading:boolean = true
  locationId!: string
  locationObject: undefined | Npc
  buyOffersFiltered: TradeOffer[] = [] // Contains npc buy offers but only the ones where the user actually has the items
  title: string = 'NPC'
  tradingMode: 'sell'|'buy' = 'buy'
  inventory: Inventory | undefined

  constructor(private modalCtrl: ModalController, private api: ApiService, public notifications: NotificationService) {}

  async ngOnInit() {
    await Promise.all([this.loadNpc(), this.loadInventory()]);
    this.setOfferInventoryCount();
    this.loading = false;
  }

  setOfferInventoryCount() {
    this.locationObject!.buyOffers.forEach(offer => {
      offer._userHas = this.inventory!.items.filter( item => item.name === offer.name ).length
    })
    this.buyOffersFiltered = this.locationObject!.buyOffers.filter(offer => offer._userHas >= 1);
    this.locationObject!.sellOffers.forEach(offer => {
      offer._userHas = this.inventory!.items.filter( item => item.name === offer.name ).length
    })
  }

  async loadNpc(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.api.getNpc(this.locationId).subscribe(
        (data: Npc) => {
          this.locationObject = data;
          resolve();
        },
        error => reject(error)
      );
    });
  }

  async loadInventory(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.api.getInventory().subscribe(
        (data: Inventory) => {
          this.inventory = data;
          resolve();
        },
        error => reject(error)
      );
    });
  }

  buyOne(tradeOffer: TradeOffer) {
    console.log('buy', tradeOffer)
    this.api.buyItem({ npcId: this.locationObject!.id, tradeOfferId: tradeOffer.id}).subscribe((data: any) => {
      this.inventory = data.inventory;
      this.setOfferInventoryCount()
      this.notifications.presentToast(`Bought 1x ${tradeOffer.name} for ${tradeOffer.sellOffer} gold.`)
    }).add(() => {
      // TODO: Prevent actions while transaction in progress?
    })
  }

  sellOne(tradeOffer: TradeOffer) {
    this.api.sellItem({ npcId: this.locationObject!.id, tradeOfferId: tradeOffer.id}).subscribe((data: any) => {
      this.inventory = data.inventory;
      this.setOfferInventoryCount()
      this.notifications.presentToast(`Sold 1x ${tradeOffer.name} for ${tradeOffer.buyOffer} gold.`)
    }).add(() => {
      // TODO: Prevent actions while transaction in progress?
    })
  }

  returnToMap() {
    return this.modalCtrl.dismiss('cancel');
  }

  protected readonly location = location;
}
