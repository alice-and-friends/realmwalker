import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {RealmLocation} from "../models/realm-location";
import {BehaviorSubject, interval, map, Observable, Subscription, tap, timer} from "rxjs";
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
import {RealmEvent} from "../models/realm-event";
import {Renewable} from "../models/renewable";
import {LootContainer} from "../models/loot-container";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url: string = env.realmwalkerApi.host;
  private serverTimeSubject = new BehaviorSubject<Date>(new Date());
  private clientTimeSubject = new BehaviorSubject<Date>(new Date());
  public serverTime: Date = new Date()
  public timeDifference: number = 0;

  constructor(private http: HttpClient) {
    // Update client and server times every second
    timer(0, 1000).subscribe(() => {
      this.updateTimes();
    });
  }

  fetchServerTime() {
    return this.http.get<{ serverTime: string }>(`${this.url}/time`).pipe(
      tap(response => {
        this.updateServerTime(response.serverTime);
      })
    );
  }

  private updateServerTime(serverTimeString: string) {
    const serverTime = new Date(serverTimeString);
    const clientTime = new Date();
    this.serverTimeSubject.next(serverTime);
    this.timeDifference = clientTime.getTime() - serverTime.getTime();
  }

  private updateTimes() {
    const clientTime = new Date();
    this.clientTimeSubject.next(clientTime); // Update client time
    const adjustedServerTime = new Date(clientTime.getTime() + this.timeDifference);
    this.serverTimeSubject.next(adjustedServerTime); // Update adjusted server time
  }

  get serverTime$() {
    return this.serverTimeSubject.asObservable();
  }

  get clientTime$() {
    return this.clientTimeSubject.asObservable();
  }

  home(): Observable<{ events: { active: RealmEvent[], upcoming: RealmEvent[] }, locations: RealmLocation[] }> {
    return this.http.get<any>(this.url + '/v1/home').pipe(
      tap(response => {
        // Update server time
        if (response && response.serverTime) {
          this.updateServerTime(response.serverTime);
        }
      }),
      map(response => {
        return {
          events: {
            active: response.events.active.map((event: any) => new RealmEvent(event, this.timeDifference)),
            upcoming: response.events.upcoming.map((event: any) => new RealmEvent(event, this.timeDifference)),
          },
          locations: response.locations.map((location: any) => new RealmLocation(location, this.timeDifference)),
        };
      })
    );
  }
  me(): Observable<User> {
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
          return new Base(data, this.timeDifference);
        })
      );
  }
  createBase() {
    return this.http.post(this.url + '/v1/base', {})
      .pipe(
        map((data: any) => {
          return new Base(data, this.timeDifference);
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
      map((items: object[]) => items.map(item => new RealmLocation(item, this.timeDifference)))
    );
  }

  getRenewable(locationId: string) {
    return this.http.get<Renewable>(this.url + `/v1/renewables/${locationId}`).pipe(
      map(data => {
        return new Renewable(data, this.timeDifference)
      })
    )
  }
  collectRenewableItems(locationId: string) {
    return this.http.post<Renewable>(this.url + `/v1/renewables/${locationId}/collect_all`, {}).pipe(
      map(data => {
        return new Renewable(data, this.timeDifference)
      })
    )
  }

  getRunestone(locationId: string) {
    return this.http.get<Runestone>(this.url + `/v1/runestones/${locationId}`).pipe(
      map(data => {
        return new Runestone(data, this.timeDifference)
      })
    )
  }
  addRunestoneToJournal(locationId: string) {
    return this.http.post<Runestone>(this.url + `/v1/runestones/${locationId}/add_to_journal`, {}).pipe(
      map(data => {
        return new Runestone(data, this.timeDifference)
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
        return new LeyLine(data, this.timeDifference)
      })
    )
  }
  captureLeyLine(id: string) {
    return this.http.post<LeyLine>(this.url + `/v1/ley_lines/${id}/capture`, {}).pipe(
      map(data => {
        return new LeyLine(data, this.timeDifference)
      })
    )
  }

  getDungeon(id: string) {
    return this.http.get<Dungeon>(this.url + `/v1/dungeons/${id}`).pipe(
      map(data => {
        return new Dungeon(data, this.timeDifference)
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
    }).pipe(
      map((data: any) => {
        if (data.inventoryChanges?.loot) {
          data.inventoryChanges.loot = new LootContainer(data.inventoryChanges.loot)
        }
        return data;
      })
    )
  }
  searchDungeon(dungeonId: string) {
    return this.http.post(this.url + `/v1/dungeons/${dungeonId}/search`, {}).pipe(
      map((data: any) => {
        data.dungeon = new Dungeon(data.dungeon, this.timeDifference)
        data.loot = new LootContainer(data.loot)
        return data;
      })
    )
  }

  getNpc(id: string) {
    return this.http.get<Npc>(this.url + `/v1/npcs/${id}`).pipe(
      map(data => {
        return new Npc(data, this.timeDifference)
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
