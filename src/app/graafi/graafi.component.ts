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
  private dataset: vis.DataSet<any>;

  ngOnInit() {

    var container = this.element.nativeElement.getElementsByClassName("vis")[0];
    let items = this.dataService.getData();

    this.dataset = new vis.DataSet(items);
    var groups = new vis.DataSet();
    groups.add({
      id: 1,
      content: "yy",
      options: {
            drawPoints: {
                style: 'circle' // square, circle
            },
            shaded: {
                orientation: 'bottom' // top, bottom
            }
        }
    });
    groups.add({
      id: 2,
      content: "kaa",
      options: {
        style: "bar"
      }
    });

    var options = {
      defaultGroup: 'unassigned',
      start: this.start || '2014-06-10',
      end: '2014-06-18'
    };
    this.graph = new vis.Graph2d(container, this.dataset, groups, options);
  }


  private klikkaus() {
    let data = this.dataService.getData();
    console.log("data", data);
    this.dataset.clear();
    this.dataset.add(data);
    this.graph.fit();
  }

}
