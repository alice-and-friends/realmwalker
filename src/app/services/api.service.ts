import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {RealmLocation} from "../models/realm-location";
import {map, Observable, tap} from "rxjs";
import {User, UserPreferences} from "../models/user";
import {environment as env} from "../../environments/environment";
import {Dungeon} from "../models/dungeon";
import {Npc} from "../models/npc";
import {BattlePrediction} from "../models/battle-prediction";
import {BattleResult} from "../models/battle-result";
import {Inventory} from "../models/inventory";
import {Base} from "../models/base";
import {Monster} from "../models/monster";
import {Runestone} from "../models/runestone";
import {Item} from "../models/item";
import {LeyLine} from "../models/ley-line";
import {Journal} from "../models/journal";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private url: string = env.api.host;
  public serverTime: Date = new Date()

  home(): Observable<any> { // TODO: Naming could be better
    return this.http.get<any>(this.url + '/v1/home').pipe(
      tap(response => {
        if (response && response.serverTime) {
          this.serverTime = new Date(response.serverTime);
        }
      })
    );
  }
  me(): Observable<User> {
    console.log('me')
    return this.http.get<User>(this.url + '/v1/users/me');
  }
  updatePreference(key: string, value: string|number|boolean): Observable<UserPreferences> {
    return this.http.patch<UserPreferences>(this.url + '/v1/users/me/preferences', {
      preferences: {[key]: value}},
    )
  }
  getBase(): Observable<Base> {
    return this.http.get(this.url + '/v1/base')
      .pipe(
        map((data: any) => {
          return new Base(data);
        })
      );
  }
  createBase() {
    return this.http.post(this.url + '/v1/base', {})
      .pipe(
        map((data: any) => {
          return new Base(data);
        })
      );
  }
  getInventory(): Observable<Inventory> {
    return this.http.get(this.url + '/v1/inventory')
      .pipe(
        map((data: any) => {
          return new Inventory(data);
        })
      );
  }
  setEquipped(itemId: string, equipped: boolean, force:boolean=false) {
    return this.http.post(this.url + '/v1/inventory/set_equipped', {
      'item_id': itemId,
      'equipped': equipped,
      'force': force,
    }).pipe(
  map((data: any) => {
        data.inventory = new Inventory(data.inventory)
        return data;
      })
    );
  }
  updateItem(id: string, params: object) {
    return this.http.patch(this.url + `/v1/inventory_items/${id}`, {
      'inventory_item': params
    })
  }

  getLocations() {
    return this.http.get<RealmLocation[]>(this.url + '/v1/realm_locations').pipe(
      map((items: object[]) => items.map(item => new RealmLocation(item)))
    );
  }

  getRunestone(id: string) {
    return this.http.get<Runestone>(this.url + `/v1/runestones/${id}`).pipe(
      map(data => {
        return new Runestone(data)
      })
    )
  }
  getJournal() {
    return this.http.get(this.url + `/v1/journal/runestones`).pipe(
      map(data => {
        return new Journal({runestones: data})
      })
    )
  }

  getLeyLine(id: string) {
    return this.http.get<LeyLine>(this.url + `/v1/ley_lines/${id}`).pipe(
      map(data => {
        return new LeyLine(data)
      })
    )
  }
  captureLeyLine(id: string) {
    return this.http.post<LeyLine>(this.url + `/v1/ley_lines/${id}/capture`, {}).pipe(
      map(data => {
        return new LeyLine(data)
      })
    )
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

  getNpc(id: string) {
    return this.http.get<Npc>(this.url + `/v1/npcs/${id}`).pipe(
      map(data => {
        return new Npc(data)
      })
    )
  }
  buyItem({npcId, tradeOfferId}: any) {
    return this.http.post(this.url + `/v1/npcs/${npcId}/trade_offers/${tradeOfferId}/buy`, {})
      .pipe(
      map((data: any) => {
        data.inventory = new Inventory(data.inventory)
        return data;
      })
    );
  }
  sellItem({npcId, tradeOfferId}: any) {
    return this.http.post(this.url + `/v1/npcs/${npcId}/trade_offers/${tradeOfferId}/sell`, {})
      .pipe(
      map((data: any) => {
        data.inventory = new Inventory(data.inventory)
        return data;
      })
    );
  }

  getCompendium(page: 'monsters'|'items') {
    return this.http.get<any[]>(this.url + `/v1/compendium/${page}`)
      .pipe(
        map((data: any[]) => data.map((item: any) => {
          switch(page) {
            case 'monsters':
              return new Monster(item);
            case 'items':
              return new Item(item);
          }
        }))
      );
  }
}
