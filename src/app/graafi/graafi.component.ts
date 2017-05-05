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
  private dataset: vis.DataSet<any> = new vis.DataSet([]);
  private messages: vis.DataSet<any> = new vis.DataSet([]);

  ngOnInit() {
    let initialStart = new Date('2016-05-16');
    let initialEnd = new Date('2016-05-18');

    var container = this.element.nativeElement.getElementsByClassName("vis")[0];

    var groups = new vis.DataSet();
    groups.add({
      id: 'pbm',
      content: "Syke",
      style: 'stroke:brown;',
      options: {
        drawPoints: {
          styles: 'stroke: brown; fll: brown',
          style: 'circle' // square, circle
        },
      }
    });
    groups.add({
      id: 'bodyWeight',
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
      id: 'limit',
      content: "Tavoite",
      style: 'green;',
      options: {
        drawPoints: {
          styles: 'green;',
          style: 'circle' // square, circle
        }
      }
    });
    groups.add({
      id: 'upperLimit',
      content: "!",
      style: 'red;',
      options: {
        drawPoints: {
          styles: 'red;',
          style: 'circle' // square, circle
        }
      }
    });

    var options = {
      defaultGroup: 'unassigned',
      legend: {
        enabled: true
      },
      start: initialStart,
      end: initialEnd,
      dataAxis: {
        visible: false,
        left: {
          range: { min: 0, max: 200 }
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

    let tlContainer = this.element.nativeElement.getElementsByClassName("timeline")[0];

    var tlOptions = {
      editable: true,
      start: initialStart,
      end: initialEnd,
    };
    this.timeline = new vis.Timeline(tlContainer, this.messages, tlOptions);

    this.graph.on('rangechange', (e) => {
      this.timeline.setWindow(e.start, e.end, { animation: false });
    });
    this.timeline.on('rangechange', (e) => {
      this.graph.setWindow(e.start, e.end, { animation: false });
    });

    this.timeline.on('doubleClick', (e) => {
      console.log(e);
      /*
      this.messages.add({
        start: e.time,
        content: "hehe"
      });
      */

    });

    this.getBundle(initialStart, initialEnd);
    this.getMessages(initialStart, initialEnd);
    this.getLowerLimit(initialStart, initialEnd);
    this.getUpperLimit(initialStart, initialEnd);
  }

  private updateData(d: any): void {
    console.log("updateData", d)
    this.dataset.clear();
    this.dataset = new vis.DataSet(d);
    this.graph.setItems(this.dataset);
  }

  private updateLimits(d: any): void {
    console.log("updateData", d)
    this.dataset.add(d);
    console.log(this.dataset);
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

  private getUpperLimit(start: Date, end: Date): void {
    let data = this.dataService.getUpperLimit(start, end);
    console.log(data);
    data.subscribe(d => this.updateLimits(d));
  }
  private getLowerLimit(start: Date, end: Date): void {
    let data = this.dataService.getLowerLimit(start, end);
    console.log(data);
    data.subscribe(d => this.updateLimits(d));
  }
}
