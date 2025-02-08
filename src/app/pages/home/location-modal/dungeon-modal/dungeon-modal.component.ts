import {Component, OnInit} from '@angular/core';
import {Dungeon} from "../../../../models/dungeon";
import {BattlePrediction} from "../../../../models/battle-prediction";
import {BattleResultModalComponent} from "./battle-result-modal/battle-result-modal.component";
import {AbstractLocationModalComponent} from "../location-modal.component";

@Component({
  selector: 'app-dungeon-modal',
  templateUrl: './dungeon-modal.component.html',
  styleUrls: ['./dungeon-modal.component.scss'],
})
export class DungeonModalComponent extends AbstractLocationModalComponent implements OnInit {
  battleResultModal: HTMLIonModalElement | undefined
  changeEquipment!: Function
  openInventory!: Function
  analysis: BattlePrediction | undefined
  battleResult: any | undefined

  async loadData() {
    this.loading = true;
    this.api.getDungeon(this.locationId).subscribe((data: Dungeon) => {
      this.locationObject = data;
      this.loading = false
    })
  }

  async analyze() {
    this.loading = true
    this.api.getBattlePrediction(this.locationId)
      .subscribe(async (data: BattlePrediction) => {
        await this.modal.setCurrentBreakpoint(0.85)
        this.analysis = data;
      })
      .add(() => this.loading = false)
  }

  battle() {
    this.analytics.events.battle({location: this.locationObject, monster: this.locationObject.monster})
    this.loading = true
    this.api.battle(this.locationId)
      .subscribe(async (battleResult: any) => {
        this.battleResult = battleResult;

        // Display battle results
        this.battleResultModal = await this.modalService.new({
          component: BattleResultModalComponent,
          cssClass: 'floating-modal',
          showBackdrop: true,
          backdropDismiss: false,
          componentProps: {
            monsterName: this.locationObject!.monster.name,
            data: this.battleResult,
            dismissParentModal: this.returnToMap,
            openInventory: this.openInventory,
          }
        });
        await this.battleResultModal.present();
      })
      .add(() => {
        this.loading = false
        this.refreshMap();
      })
  }
}
