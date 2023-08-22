import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {RealmLocation} from "../models/realm-location";
import {map, Observable} from "rxjs";
import {User} from "../models/user";
import {environment as env} from "../../environments/environment";
import {Dungeon} from "../models/dungeon";
import {Battlefield} from "../models/battlefield";
import {Npc} from "../models/npc";
import {InventoryItem} from "../models/inventory-item";
import {BattlePrediction} from "../models/battle-prediction";
import {BattleResult} from "../models/battle-result";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private url = env.api.host;

  me(): Observable <User> {
    return this.http.get<User>(this.url + '/v1/users/me');
  }
  getInventory() {
    return this.http.get(this.url + '/v1/inventory')
      .pipe(
        map((data: any) => {
          const inventoryItems = data.items.map((item: any) => new InventoryItem(item));
          return { items: inventoryItems, ...data };
        })
      );
  }
  setEquipped(itemId: string, equipped: boolean, force:boolean=false) {
    return this.http.post(this.url + '/v1/inventory/set_equipped', {
      'item_id': itemId,
      'equipped': equipped,
      'force': force,
    })
  }

  getLocations() {
    return this.http.get<RealmLocation[]>(this.url + '/v1/realm_locations')
      .pipe(
        map((data: any[]) => data.map((item: any) => {
          const model = new RealmLocation(item);
          return model;
        }))
      );
  }

  getDungeon(id: string) {
    return this.http.get<Dungeon>(this.url + `/v1/dungeons/${id}`).pipe(
      map(data => {
        return new Dungeon(data)
      })
    )
  }
  getBattlePrediction(dungeonId: string) {
    return this.http.get<BattlePrediction>(this.url + `/v1/dungeons/${dungeonId}/analyze`).pipe(
      map(data => {
        return new BattlePrediction(data)
      })
    )
  }
  battle(dungeonId: string) {
    return this.http.post<BattleResult>(this.url + `/v1/dungeons/${dungeonId}/battle`, {
      // TODO: Battle options?
    })
  }

  getBattlefield(id: string) {
    return this.http.get<Battlefield>(this.url + `/v1/battlefields/${id}`).pipe(
      map(data => {
        return new Battlefield(data)
      })
    )
  }

  getNpc(id: string) {
    return this.http.get<Npc>(this.url + `/v1/npcs/${id}`).pipe(
      map(data => {
        return new Npc(data)
      })
    )
  }
}
