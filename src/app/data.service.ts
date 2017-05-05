import { Injectable } from '@angular/core';

@Injectable()
export class DataService {

  constructor() { }

  public getData(): any {
      let data = [
        {group: 1, x: '2014-06-11', y: 10},
        {group: 2, x: '2014-06-12', y: 25},
        {group: 1, x: '2014-06-13', y: Math.random() * 100},
        {group: 1, x: '2014-06-14', y: 110},
        {group: 2, x: '2014-06-15', y: 115},
        {group: 1, x: '2014-06-16', y: 30}
      ];
      return data;
  }

}
