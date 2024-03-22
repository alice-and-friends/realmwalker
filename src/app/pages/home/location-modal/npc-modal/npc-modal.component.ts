import { Component, OnInit } from '@angular/core';
import {Npc} from "../../../../models/npc";
import {Inventory} from "../../../../models/inventory";
import {TradeOffer} from "../../../../models/trade-offer";
import {AbstractLocationModalComponent} from "../location-modal.component";

@Component({
  selector: 'app-npc-modal',
  templateUrl: './npc-modal.component.html',
  styleUrls: ['./npc-modal.component.scss'],
})
export class NpcModalComponent extends AbstractLocationModalComponent implements OnInit {
  buyOffersFiltered: TradeOffer[] = [] // Contains npc buy offers but only the ones where the user actually has the items
  tradingMode: 'sell'|'buy' = 'buy'
  inventory: Inventory | undefined
  override title: string = 'NPC'

  async loadData() {
    this.loading = true;
    await Promise.all([this.loadNpc(), this.loadInventory()]);
    this.setOfferInventoryCount();
    this.loading = false;
  }

  setOfferInventoryCount() {
    this.locationObject.buyOffers.forEach((offer: any) => {
      offer._userHas = this.inventory!.items.filter( item => item.name === offer.name ).length
    })
    this.buyOffersFiltered = this.locationObject.buyOffers.filter((offer: any) => offer._userHas >= 1);
    this.locationObject.sellOffers.forEach((offer: any) => {
      offer._userHas = this.inventory!.items.filter( item => item.name === offer.name ).length
    })
  }

  async loadNpc(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.api.getNpc(this.locationId).subscribe({
        next: (data: Npc) => {
          this.locationObject = data;
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

  buyOne(tradeOffer: TradeOffer) {
    this.api.buyItem({ npcId: this.locationObject.id, tradeOfferId: tradeOffer.id}).subscribe((data: any) => {
      this.inventory = data.inventory;
      this.setOfferInventoryCount()
      this.notifications.presentToast(`Bought 1x ${tradeOffer.name} for ${tradeOffer.sellOffer} gold.`)
    }).add(() => {
      // TODO: Prevent actions while transaction in progress?
    })
  }

  sellOne(tradeOffer: TradeOffer) {
    this.api.sellItem({ npcId: this.locationObject.id, tradeOfferId: tradeOffer.id}).subscribe((data: any) => {
      this.inventory = data.inventory;
      this.setOfferInventoryCount()
      this.notifications.presentToast(`Sold 1x ${tradeOffer.name} for ${tradeOffer.buyOffer} gold.`)
    }).add(() => {
      // TODO: Prevent actions while transaction in progress?
    })
  }
}
