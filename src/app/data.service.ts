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


//http://localhost:3000/search/?q=\{"uid":"9"\}
  public getOdaData(): any {
    return this.http.get('https://oda.medidemo.fi/phr/baseDstu3/Observation/258').map((d) => {
      let json = d.json();
      console.log(json);
      return {
        //x: json.effectiveDateTime,
        y: json[0].created,
        group: 2
      };
    });
  }

  public getOdaData2(): any {
    return this.http.get('https://oda.medidemo.fi/phr/baseDstu3/Observation').map((d) => {
      let json = d.json();
      return {
        x: json.effectiveDateTime,
        y: json.valueQuantity.value,
        group: 2
      };
    });

  }

}
