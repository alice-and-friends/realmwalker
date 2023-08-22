import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ApiService} from "../../services/api.service";
import {Dungeon} from "../../models/dungeon";
import {BattlePrediction} from "../../models/battle-prediction";
import {BattleResultModalComponent} from "./battle-result-modal/battle-result-modal.component";

@Component({
  selector: 'app-dungeon-modal',
  templateUrl: './dungeon-modal.component.html',
  styleUrls: ['./dungeon-modal.component.scss'],
})
export class DungeonModalComponent implements OnInit {
  loading:boolean = true
  locationId!: string
  locationObject: undefined | Dungeon
  modal!: HTMLIonModalElement
  battleResultModal: HTMLIonModalElement | undefined
  analysis: BattlePrediction | undefined
  openCharacterModal!: any
  battleResult: any | undefined

  constructor(private modalCtrl: ModalController, private api: ApiService) {
  }

  ngOnInit() {
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
    this.loading = true
    this.api.battle(this.locationId)
      .subscribe(async (battleResult: any) => {
        this.battleResult = battleResult;

        // Display battle results
        this.battleResultModal = await this.modalCtrl.create({
          component: BattleResultModalComponent,
          cssClass: 'floating-modal',
          showBackdrop: true,
          backdropDismiss: false,
          componentProps: {
            monsterName: this.locationObject!.monster.name,
            data: this.battleResult,
            dismissParentModal: this.returnToMap,
            openCharacterModal: this.openCharacterModal
          }
        });
        await this.battleResultModal.present();
      })
      .add(() => this.loading = false)
  }

  returnToMap() {
    return this.modalCtrl.dismiss('cancel');
  }
}
