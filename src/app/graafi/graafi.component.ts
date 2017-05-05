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
      id: 'pbm',
      content: "Syke",
      style: 'stroke:brown;',
      options: {
            drawPoints: {
                styles: 'stroke: brown; fill: brown',
                style: 'circle' // square, circle
            },
        }
    });
    groups.add({
      id: 'bodyWeight',
      //className: "group-bodyWeight",
      content: "Paino",
      style: 'stroke:blue;',
      options: {
        drawPoints: {
          styles: 'stroke: blue; fill: blue',
          style: 'circle' // square, circle
        }
      }
    });
    groups.add({
      id: 'bodyHeight',
      content: "Pituus",
      style: 'stroke:yellowgreen;',
      options: {
        drawPoints: {
          styles: 'stroke: yellowgreen; fill: yellowgreen',
          style: 'circle' // square, circle
        }
      }
    });
    groups.add({
      id: 'message',
      options: {
        style: "bar",
      }
    });

    var options = {
      defaultGroup: 'unassigned',
      legend: {
        enabled: true
      },
      start: '2016-05-16',
      end: '2016-05-18',
      dataAxis: {
        left: {
            range: {min:0, max:200}
        }
      }
    };
    this.graph = new vis.Graph2d(container, this.dataset, groups, options);

    let timeout;
    this.graph.on('rangechanged', (e) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        this.getBundle(e.start, e.end);
      }, 400);

    });

    this.graph.on('doubleClick', (e) => {
      console.log(e);

    });
    this.getBundle(new Date('2016-05-16'), new Date('2016-05-18'));
  }

  private updateData(d: any): void {
    console.log("updateData", d)
    //this.dataset.clear();
    //this.dataset.update(d);
    //this.graph.fit();
    console.log(this.dataset.length);

    this.dataset.clear();
    this.dataset = new vis.DataSet(d);
    this.graph.setItems(this.dataset);
  }

  private getData() {
    let data = this.dataService.getOdaData();
    data.subscribe(d => this.updateData(d));
  }

  private getBundle(start: Date, end: Date): void {
    let data = this.dataService.getBundle(start, end);
    data.subscribe(d => this.updateData(d));
  }
}
