import { Injectable } from '@angular/core';
import {User} from "../models/user";
import {ApiService} from "./api.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public loggedIn = false;
  public activeUser: User | undefined;

  constructor(private api: ApiService, private router: Router) {}

  login() {
    this.api.me().subscribe(
      (response: any) => {
        this.activeUser = response;
        this.loggedIn = true;
        this.router.navigate(['/home'])
      },
      () => {
        this.activeUser = undefined;
        this.loggedIn = false;
        this.router.navigate(['/launch'])
      }
    );
  }
}
