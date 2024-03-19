import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
})
export class ModalHeaderComponent {
  defaultColor = 'dark'
  @Input() icon?: string
  @Input() iconColor?: string = this.defaultColor
  @Input() iconBorder?: boolean = true
  @Input() title?: string = this.defaultColor
  @Input() titleColor?: string
  @Input() description?: string
  @Input() quote?: string

  constructor() { }
}
