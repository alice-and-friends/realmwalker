import {Component, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {UserService} from "./services/user.service";
import {LocationService} from "./services/location.service";
import {ApiService} from "./services/api.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  localTime: Date = new Date()

  constructor(public auth: AuthService, public userService: UserService, public location: LocationService, public api: ApiService) {}

  async ngOnInit() {
    const locationServiceOperational = await this.location.init();
    console.debug('Location service reports operational:', locationServiceOperational, 'Initial position:', this.location.latitude, this.location.longitude)
    if (locationServiceOperational) {
      this.location.track();
      this.userService.login();
    } else {
      console.warn('Login aborted due to problem with location service')
    }
  }
}
