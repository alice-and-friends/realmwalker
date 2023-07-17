import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import {environment as env} from "../../environments/environment";
import {User} from "../models/user";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //public loggedIn = false;
  public activeUser: User | undefined;

  constructor(private api: ApiService) {}

  login() {
    this.api.me().subscribe(
      (response: any) => {
        this.activeUser = response;
        //this.loggedIn = true;
      },
      () => {
        this.activeUser = undefined;
        //this.loggedIn = false;
      }
    );
  }
}
