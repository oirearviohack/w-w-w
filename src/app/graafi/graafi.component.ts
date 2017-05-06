import { Component, OnInit, Input, ApplicationRef, ElementRef } from '@angular/core';

import { DataService } from '../data.service';

import * as vis from 'vis';

@Component({
  selector: 'graafi',
  templateUrl: './graafi.component.html',
  styleUrls: ['./graafi.component.css']
})


export class GraafiComponent implements OnInit {

  constructor(
    private element: ElementRef,
    private dataService: DataService
  ) {

  }

  private graph: vis.Graph2d;
  private timeline: vis.Timeline;
  private dataset: vis.DataSet<any> = new vis.DataSet([]);
  private messages: vis.DataSet<any> = new vis.DataSet([]);
  private messagesById: any = {};
  private lowerLimit: any;
  private upperLimit: any;

  private selectedMessage: any = null;

  private loading: boolean = false;

  ngOnInit() {
    let initialStart = new Date('2016-05-16');
    let initialEnd = new Date('2016-05-18');

    var container = this.element.nativeElement.getElementsByClassName("vis")[0];

    var groups = new vis.DataSet();
    groups.add({
      id: 'bpm',
      content: "Syke",
      style: 'stroke:brown;',
      options: {
        style: 'points',
        drawPoints: {
          styles: 'stroke: brown; fill: brown',
          style: 'circle' // square, circle
        }
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
      id: 'lowerLimit',
      content: "Tavoite",
      style: 'stroke:green;',
      options: {
        drawPoints: {
          styles: 'stroke:green; fill: green,',
          style: 'circle' // square, circle
        },
        shaded: {
          orientation: 'bottom',
          style: 'fill:#0df200;fill-opacity:0.1;' // top, bottom
        }
      }
    });
    groups.add({
      id: 'upperLimit',
      content: "!",
      style: 'stroke:red;',
      options: {
        drawPoints: {
          styles: 'stroke:red; fill: red,',
          style: 'square' // square, circle
        },
        shaded: {
          orientation: 'top', // top, bottom
          style: 'fill:red;fill-opacity:0.1;'

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
      this.loading = true;
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        this.loadData(e.start, e.end);
      }, 250);
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

    this.timeline.on('select', (e) => {
      console.log("select", e);
      if (e.items.length > 0) {
        let id = e.items[0];
        this.selectedMessage = this.messagesById[id];
        console.log(this.selectedMessage);
      }
      else {
        this.selectedMessage = null;
      }
    });

    this.getLowerLimit(initialStart, initialEnd);
    this.getUpperLimit(initialStart, initialEnd);

    this.loadData(initialStart, initialEnd);
  }

  private loadData(start: Date, end: Date): void {
    this.getBundle(start, end);
    this.getMessages(start, end);
  }

  private firstWeight(d: any): any {
    let f = null;
    for (let i = 0; i < d.length; i++) {
      console.log(d[i]);
      if (d[i].group !== 'bodyWeight') {
        continue;
      }
      if (!f || d[i].x < f.x) {
        f = d[i];
      }
    }
    return f;
  }

  private lastWeight(d: any): any {
    let f = null;
    for (let i = 0; i < d.length; i++) {
      console.log(d[i]);
      if (d[i].group !== 'bodyWeight') {
        continue;
      }
      if (!f || d[i].x > f.x) {
        f = d[i];
      }
    }
    return f;
  }

  private updateData(d: any): void {
    console.log("updateData", d)

    let h1 = this.firstWeight(d);
    if (h1) {
      let dat = new Date(h1.x);
      dat.setFullYear(dat.getFullYear() - 1);
      d.push({
        x: dat,
        y: h1.y,
        group: h1.group
      });
    }
    let h2 = this.lastWeight(d);
    if (h2) {
      let dat = new Date(h2.x);
      dat.setFullYear(dat.getFullYear() + 1);
      d.push({
        x: dat,
        y: h2.y,
        group: h2.group
      });
    }


    this.dataset.clear();
    this.dataset = new vis.DataSet(d);

    this.dataset.add(this.upperLimit);
    this.dataset.add(this.lowerLimit);
    this.graph.setItems(this.dataset);
    this.loading = false;
  }

  private updateMessages(d: any): void {
    console.log("updateMessages", d)
    d.forEach((m) => {
      this.messagesById[m.id] = m;
    });
    console.log(this.messagesById);
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
    this.upperLimit = this.dataService.getUpperLimit(start, end);
    this.dataService.getUpperLimit(start, end).subscribe((d) => {
      this.upperLimit = d;
    });
  }

  private getLowerLimit(start: Date, end: Date): void {
    this.lowerLimit = this.dataService.getLowerLimit(start, end);
    this.dataService.getLowerLimit(start, end).subscribe((d) => {
      this.lowerLimit = d;
    });
  }

}
