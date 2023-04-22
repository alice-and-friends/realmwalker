import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {RealmLocation} from "./models/realm_location";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  rootURL = 'http://localhost:3000/api/v1';

  getLocations() {
    return this.http.get<RealmLocation[]>(this.rootURL + '/realm_locations')
      .pipe(
        map((data: any[]) => data.map((item: any) => {
          const model = new RealmLocation(item);
          return model;
        }))
      );
  }

  getDungeon(id: string) {
    const data = this.http.get(`/dungeons/${id}`);
  }

  getNpc(id: string) {
    const data = this.http.get(`/dungeons/${id}`);
  }

  battle(dungeonId: string) {
    return this.http.post(this.rootURL + `/dungeons/${dungeonId}/battle`, {
      // TODO: Battle options
    })
  }
}
