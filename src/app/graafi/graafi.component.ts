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
  private jotain: any;

  ngOnInit() {

    var container = this.element.nativeElement.getElementsByClassName("vis")[0];
    //let items = this.dataService.getData();

    this.dataset = new vis.DataSet([]);
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
      //start: this.start || '2014-06-10',
      //end: '2014-06-18'/*,
      dataAxis: {
        left: {
            range: {min:0, max:200}
        }
      }
    };
    this.graph = new vis.Graph2d(container, this.dataset, groups, options);
    this.getData();
  }

  private updateData(d: any): void {
    console.log("updateData", d)
    this.dataset.clear();
    this.dataset.add(d);
    this.graph.fit();
  }

  private getData() {
    let data = this.dataService.getOdaData();
    data.subscribe(d => this.updateData(d));
  }

}
