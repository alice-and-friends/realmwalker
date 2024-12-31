import { Component } from '@angular/core';
import {BattleResult} from "../../../../../models/battle-result";
import {determineArticle, capitalize} from "../../../../../lib/util";
import {ModalService} from "../../../../../services/modal.service";

@Component({
  selector: 'app-battle-result-modal',
  templateUrl: './battle-result-modal.component.html',
  styleUrls: ['./battle-result-modal.component.scss'],
})
export class BattleResultModalComponent {
  modal!: HTMLIonModalElement
  monsterName!: string
  data!: BattleResult
  dismissParentModal!: any
  openCharacterModal!: any

  constructor(private modalService: ModalService) { }

  async returnToMap() {
    await this.modalService.dismissAll();
  }

  async viewInventory() {
    await this.modalService.dismissAll();
    return this.openCharacterModal()
  }

  formattedLootList() {
    let loot: string[] = []
    for (let item of this.data.inventoryChanges?.loot?.items!) loot.push(`${determineArticle(item.name)} ${item.name.toLowerCase()}`)
    if (this.data.inventoryChanges?.loot?.gold) loot.push(`${this.data.inventoryChanges.loot.gold} gold coins`)
    return capitalize(loot.join(', '))
  }
}
