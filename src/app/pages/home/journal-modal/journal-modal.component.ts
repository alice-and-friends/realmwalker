import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {Journal} from "../../../models/journal";
import {ModalService} from "../../../services/modal.service";

@Component({
  selector: 'app-journal-modal',
  templateUrl: './journal-modal.component.html',
  styleUrls: ['./journal-modal.component.scss'],
})
export class JournalModalComponent  implements OnInit {
  journal?: Journal

  constructor(private api: ApiService, private modalService: ModalService) { }

  ngOnInit() {
    this.api.getJournal().subscribe((data: any) => {
      this.journal = data;
    })
  }

  cancel() {
    this.modalService.dismiss()
  }
}
