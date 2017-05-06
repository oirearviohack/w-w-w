import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input('msg') msg: any;

  constructor() { }

  ngOnInit() {
    console.log("keke", this.msg);
  }

}
