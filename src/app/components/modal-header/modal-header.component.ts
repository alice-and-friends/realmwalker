import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
})
export class ModalHeaderComponent {
  @Input() icon?: string
  @Input() iconColor?: string = 'dark'
  @Input() iconBorder?: boolean = true
  @Input() title?: string
  @Input() description?: string
  @Input() quote?: string

  constructor() { }
}
