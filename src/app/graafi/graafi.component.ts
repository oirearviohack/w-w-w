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
  private timeline: vis.Timeline;
  private dataset: vis.DataSet<any>;
  private messages: vis.DataSet<any>;
  private jotain: any;

  ngOnInit() {

    var container = this.element.nativeElement.getElementsByClassName("vis")[0];

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
        visible: false,
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
        this.getMessages(e.start, e.end);
      }, 400);
    });


    this.graph.on('doubleClick', (e) => {
      console.log(e);
      this.dataset.add({
        x: e.time,
        y: 100,
        group: "message",
        id: "" + Math.random()
      });

    });



    let tlContainer = this.element.nativeElement.getElementsByClassName("timeline")[0];

    this.timeline = new vis.Timeline(tlContainer, [], {});

    this.graph.on('rangechange', (e) => {
      this.timeline.setWindow(e.start, e.end, {animation: false});
    });
    this.timeline.on('rangechange', (e) => {
      this.graph.setWindow(e.start, e.end, {animation: false});
    });

    this.getBundle(new Date('2016-05-16'), new Date('2016-05-18'));
    this.getMessages(new Date('2016-05-16'), new Date('2016-05-18'));
  }

  private updateData(d: any): void {
    console.log("updateData", d)
    this.dataset.clear();
    this.dataset = new vis.DataSet(d);
    this.graph.setItems(this.dataset);
  }

  private updateMessages(d: any): void {
    console.log("updateMessages", d)
    if (this.messages) {
      this.messages.clear();
    }
    this.messages = new vis.DataSet(d);
    this.timeline.setItems(this.messages);
  }

  private getBundle(start: Date, end: Date): void {
    let data = this.dataService.getBundle(start, end);
    data.subscribe(d => this.updateData(d));
  }

  private getMessages(start: Date, end: Date): void {
    let data = this.dataService.getMessages(start, end);
    data.subscribe(d => this.updateMessages(d));
  }
}
