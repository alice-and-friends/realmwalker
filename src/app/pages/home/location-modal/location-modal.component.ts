import {Directive, OnInit} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {NotificationService} from "../../../services/notification.service";
import {AnalyticsService} from "../../../services/analytics.service";
import {ModalService} from "../../../services/modal.service";

@Directive() // Using @Directive() since Angular doesn't allow @Component on abstract classes
export abstract class AbstractLocationModalComponent implements OnInit {
  modal!: HTMLIonModalElement
  loading:boolean = true
  locationId!: string
  locationObject: any
  title!: string
  refreshMap!: Function

  constructor(
    public analytics: AnalyticsService,
    protected modalService: ModalService,
    protected api: ApiService,
    public notifications: NotificationService,
  ) {}

  async ngOnInit() {
    this.loadData();
  }

  returnToMap() {
    this.modalService.dismiss()
  }

  abstract loadData(): void;
}
