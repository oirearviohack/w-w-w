import { Component, OnInit, Input, ApplicationRef, ElementRef } from '@angular/core';

import * as vis from 'vis';

@Component({
  selector: 'graafi',
  templateUrl: './graafi.component.html',
  styleUrls: ['./graafi.component.css']
})


export class GraafiComponent implements OnInit {

  @Input('title') title: string;
  @Input() start: string;

  constructor(private element: ElementRef) {}

  ngOnInit() {

    var container = this.element.nativeElement.getElementsByClassName("vis")[0];
    var items = [
      {x: '2014-06-11', y: 10},
      {x: '2014-06-12', y: 25},
      {x: '2014-06-13', y: 30},
      {x: '2014-06-14', y: 10},
      {x: '2014-06-15', y: 15},
      {x: '2014-06-16', y: 30}
    ];

    var dataset = new vis.DataSet(items);
    var options = {
      start: this.start || '2014-06-10',
      end: '2014-06-18'
    };
    var graph2d = new vis.Graph2d(container, dataset, options);
  }

}
