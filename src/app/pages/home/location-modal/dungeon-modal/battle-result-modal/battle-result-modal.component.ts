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
  openInventory!: any

  constructor(private modalService: ModalService) { }

  async returnToMap() {
    await this.modalService.dismissAll();
  }

  async viewInventory() {
    await this.modalService.dismissAll();
    return this.openInventory()
  }
}
