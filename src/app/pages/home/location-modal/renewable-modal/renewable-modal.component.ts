import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractLocationModalComponent} from "../location-modal.component";
import {Renewable, RenewableType} from "../../../../models/renewable";

@Component({
  selector: 'app-renewable-modal',
  templateUrl: './renewable-modal.component.html',
  styleUrls: ['./renewable-modal.component.scss'],
})
export class RenewableModalComponent extends AbstractLocationModalComponent implements OnInit, OnDestroy {
  override locationObject: Renewable | undefined
  private refreshTimer?: ReturnType<typeof setTimeout>;

  loadData() {
    this.loading = true;
    this.api.getRenewable(this.locationId).subscribe((data: Renewable) => {
      this.locationObject = data;
      this.loading = false
      if (data.nextGrowthAt) {
        this.setRefreshTimer()
      }
    })
  }

  refreshInventory() {
    this.locationObject!.nextGrowthAt = undefined;
    this.api.getRenewable(this.locationId).subscribe((data: Renewable) => {
      this.locationObject!.inventory = data.inventory;
      if (data.nextGrowthAt) {
        this.locationObject!.nextGrowthAt = data.nextGrowthAt;
        this.setRefreshTimer()
      }
    })
  }

  collectAll() {
    this.locationObject!.nextGrowthAt = undefined;
    this.api.collectRenewableItems(this.locationId).subscribe((data: Renewable) => {
      this.locationObject!.inventory = data.inventory;
      if (data.nextGrowthAt) {
        this.locationObject!.nextGrowthAt = data.nextGrowthAt;
        this.setRefreshTimer()
      }
    })
  }

  setRefreshTimer() {
    const milliDiff: number = this.locationObject!.nextGrowthAt!.getTime() - new Date().getTime();
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => this.refreshInventory(), Math.max(5_000, milliDiff))

  }

  ngOnDestroy() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
  }
}
