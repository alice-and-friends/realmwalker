import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Monster} from "../../models/monster";

@Component({
  selector: 'app-monsters',
  templateUrl: './monsters.page.html',
  styleUrls: ['./compendium.scss'],
})
export class MonstersPage implements OnInit {
  monsters: any = [];
  levels: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  classifications: Set<string> = new Set()
  constructor(public api: ApiService) {}

  ngOnInit() {
    this.api.getCompendium('monsters').subscribe((monsters) => {
      this.monsters = monsters;
      this.classifications = new Set(this.monsters.map((monster: Monster) => monster.classification).sort());
    })
  }

  getMonsters(level: number, classification: string): Monster[] {
    return this.monsters.filter((monster: Monster) =>
      monster.level === level && monster.classification === classification
    );
  }
}
