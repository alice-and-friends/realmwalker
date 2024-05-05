import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
})
export class ModalHeaderComponent implements OnInit {
  defaultColor = 'dark'
  @Input() icon?: string
  @Input() iconColor?: string
  @Input() iconBorder?: boolean = true
  @Input() title?: string
  @Input() titleColor?: string
  @Input() description?: string
  @Input() quote?: string

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.iconColor = this.iconColor || this.defaultColor;
    this.titleColor = this.titleColor || this.defaultColor;
    if (this.quote) {
      let userName = this.userService.activeUser!.name;
      this.quote = this.quote.replace('%user_name%', userName)
    }
  }
}
