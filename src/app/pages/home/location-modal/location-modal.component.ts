import {Directive, OnInit} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {NotificationService} from "../../../services/notification.service";
import {AnalyticsService} from "../../../services/analytics.service";
import {ModalService} from "../../../services/modal.service";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user";

@Directive() // Using @Directive() since Angular doesn't allow @Component on abstract classes
export abstract class AbstractLocationModalComponent implements OnInit {
  modal!: HTMLIonModalElement
  loading:boolean = true
  locationId!: string
  locationObject: any
  title!: string
  refreshMap!: Function
  user: User

  constructor(
    public analytics: AnalyticsService,
    protected modalService: ModalService,
    protected api: ApiService,
    public notifications: NotificationService,
    public userService: UserService,
  ) {
    this.user = userService.activeUser!
  }

  async ngOnInit() {
    this.loadData();
  }

  returnToMap() {
    void this.modalService.dismiss()
  }

  abstract loadData(): void;
}
