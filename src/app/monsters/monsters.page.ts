import { Component, OnInit } from '@angular/core';
import {ApiService} from "../services/api.service";
import {Monster} from "../models/monster";

@Component({
  selector: 'app-monsters',
  templateUrl: './monsters.page.html',
  styleUrls: ['./monsters.page.scss'],
})
export class MonstersPage implements OnInit {
  monsters: any = [];
  levels: Set<number> = new Set()
  classifications: Set<string> = new Set()
  constructor(public api: ApiService) {}

  ngOnInit() {
    this.api.getMonsters().subscribe((monsters) => {
      this.monsters = monsters;
      this.levels = new Set(this.monsters.map((monster: Monster) => monster.level));
      this.classifications = new Set(this.monsters.map((monster: Monster) => monster.classification).sort());
    })
  }

  getMonsters(level: number, classification: string): Monster[] {
    return this.monsters.filter((monster: Monster) =>
      monster.level === level && monster.classification === classification
    );
  }
}
