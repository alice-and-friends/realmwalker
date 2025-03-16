import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {Battle} from "../../models/battle";

@Component({
  selector: 'app-battle',
  templateUrl: './battle.page.html',
  styleUrls: ['./battle.page.scss'],
})
export class BattlePage implements OnInit {
  battleId: string | null = null
  battle?: Battle

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  async ngOnInit() {
    this.battleId = this.route.snapshot.paramMap.get('id');
    await this.loadBattle()
  }

  async loadBattle() {
    this.api.getBattle(this.battleId!).subscribe((battle) => {
      this.battle = battle;
    })
  }
}
