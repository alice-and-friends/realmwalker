import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {Battle} from "../../models/battle";
import {BattleTurnStatus} from "../../models/battle-turn";

@Component({
  selector: 'app-battle',
  templateUrl: './battle.page.html',
  styleUrls: ['./battle.page.scss'],
})
export class BattlePage implements OnInit {
  battleId: string | null = null
  battle?: Battle

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService) {}

  async ngOnInit() {
    this.battleId = this.route.snapshot.paramMap.get('id');
    await this.loadBattle()
  }

  async loadBattle() {
    this.api.getBattle(this.battleId!).subscribe((battle) => {
      this.battle = battle;
    })
  }

  async goToMap() {
    void this.router.navigate(['/home'])
  }

  actionMenuAvailable() {
    let currentTurn = this.battle?.currentTurn
    return (currentTurn && currentTurn.status === BattleTurnStatus.WaitingOnActor && currentTurn.actor.isCurrentUser)
  }

  availableActions() {
    return this.battle?.currentTurn?.availableActions || []
  }

  selectAction(action: any) {
    console.log(action)
  }
}
