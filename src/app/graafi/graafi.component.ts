import { Component, OnInit, Input, ApplicationRef, ElementRef } from '@angular/core';

import { DataService } from '../data.service';

import * as vis from 'vis';

@Component({
  selector: 'graafi',
  templateUrl: './graafi.component.html',
  styleUrls: ['./graafi.component.css']
})


export class GraafiComponent implements OnInit {

  @Input('title') title: string;
  @Input() start: string;

  constructor(
    private element: ElementRef,
    private dataService: DataService
  ) {

  }

  private graph: vis.Graph2d;

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
    this.graph = new vis.Graph2d(container, dataset, options);
  }


  private klikkaus() {
    this.graph.fit();
    let data = this.dataService.getData();
    console.log("data", data);
  }

}
