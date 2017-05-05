import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map'

@Injectable()
export class DataService {

  constructor(private http: Http) { }

  public getData(): any   {
    return this.http.get('/assets/fhir/weight.json').map((d) => {
      let json = d.json();
      return {
        x: json.effectiveDateTime,
        y: json.valueQuantity.value,
        group: 2
      };
    });
  }

}
