import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
})
export class CallbackComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('you reached the callback component')
  }

}
