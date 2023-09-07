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
    console.info('User service starting login procedure')
    this.api.me().subscribe({
      next: (response: any) => {
        this.activeUser = response;
        this.loggedIn = true;
        console.info('User service redirecting to home route')
        this.router.navigate(['/home'])
      },
      error: (err: any) => {
        console.warn(err)
        this.activeUser = undefined;
        this.loggedIn = false;
        this.router.navigate(['/launch'])
      }
    });
  }
}
