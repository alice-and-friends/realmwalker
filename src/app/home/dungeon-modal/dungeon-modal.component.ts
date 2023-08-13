import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {LocationType} from "../../models/realm-location";
import {ApiService} from "../../services/api.service";
import {Dungeon} from "../../models/dungeon";
import {BattlePrediction} from "../../models/battle-prediction";

@Component({
  selector: 'app-dungeon-modal',
  templateUrl: './dungeon-modal.component.html',
  styleUrls: ['./dungeon-modal.component.scss'],
})
export class DungeonModalComponent implements OnInit {
  locationId!: string
  locationObject: undefined | Dungeon
  modal!: HTMLIonModalElement
  analysis: BattlePrediction | undefined
  loading:boolean = true
  openCharacterModal!: any

  constructor(private modalCtrl: ModalController, private api: ApiService) {
    console.log('dungeon modal has a openCharacterModal', this.openCharacterModal)
  }

  ngOnInit() {
    this.api.getDungeon(this.locationId).subscribe((data: Dungeon) => {
      this.locationObject = data;
      this.loading = false
    })
  }

  async analyze() {
    this.loading = true
    this.api.getBattlePrediction(this.locationId).subscribe(async (data: BattlePrediction) => {
      await this.modal.setCurrentBreakpoint(0.95)
      this.analysis = data;
      this.loading = false
    })
  }
  changeEquipment() {
    this.openCharacterModal()
  }
  battle() {
    this.loading = true
    this.api.battle(this.locationId).subscribe((result: any) => {
      if (result.defeated) {
        this.loading = false
        alert('Victory!')
      }
    })
  }

  cancel() {
    return this.modalCtrl.dismiss('cancel');
  }

  protected readonly LocationType = LocationType;
}
