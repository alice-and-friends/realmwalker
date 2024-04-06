import { Component } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {BattleResult} from "../../../../../models/battle-result";
import {determineArticle, capitalize} from "../../../../../lib/util";

@Component({
  selector: 'app-battle-result-modal',
  templateUrl: './battle-result-modal.component.html',
  styleUrls: ['./battle-result-modal.component.scss'],
})
export class BattleResultModalComponent {
  monsterName!: string
  data!: BattleResult
  dismissParentModal!: any
  openCharacterModal!: any

  constructor(private modalCtrl: ModalController) { }

  async returnToMap() {
    await this.modalCtrl.dismiss('cancel');
    return this.dismissParentModal()
  }

  async viewInventory() {
    await this.modalCtrl.dismiss('cancel');
    return this.openCharacterModal()
  }

  formattedLootList() {
    let loot: string[] = []
    for (let item of this.data.inventoryChanges?.loot?.items) loot.push(`${determineArticle(item.name)} ${item.name.toLowerCase()}`)
    if (this.data.inventoryChanges?.loot?.gold) loot.push(`${this.data.inventoryChanges.loot.gold} gold coins`)
    return capitalize(loot.join(', '))
  }
}
