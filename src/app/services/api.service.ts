import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {RealmLocation} from "../models/realm_location";
import {map, Observable} from "rxjs";
import {User} from "../models/user";
import {environment as env} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private url = env.api.host;

  me(): Observable <User> {
    return this.http.get<User>(this.url + '/v1/users/me');
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

  getDungeon(id: string): Observable<any> {
    return this.http.get(this.url + `/v1/dungeons/${id}`);
  }

  getNpc(id: string): Observable<any> {
    return this.http.get(this.url + `/v1/dungeons/${id}`);
  }

  battle(dungeonId: string) {
    return this.http.post(this.url + `/v1/dungeons/${dungeonId}/battle`, {
      // TODO: Battle options
    })
  }
}
