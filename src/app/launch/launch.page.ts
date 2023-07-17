import { Component, OnInit } from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-launch',
  templateUrl: './launch.page.html',
  styleUrls: ['./launch.page.scss'],
})
export class LaunchPage implements OnInit {

  constructor(public auth: AuthService, public userService: UserService) { }

  ngOnInit() {
    if(this.auth.isAuthenticated$) {
      console.log('yeh', this.userService.activeUser)
    }
    else {
      console.log('neh')
    }
    setInterval(() => {
      console.log('hello world')
    }, 2000)

  }

  handleLogin(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: '/home',
      },
    });
  }

  protected readonly document = document;
}
