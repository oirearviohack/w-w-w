import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'

@Injectable()
export class DataService {

  private GROUPS: any = {
    'http://loinc.org': {
      '8867-4': 'pbm',
      '3141-9': 'bodyWeight',
      '8302-2': 'bodyHeight',
      '8310-5': 'bodyTemperature'
    },
    'joku_muu': {
      '8867-4': 'pbm',
      '3141-9': 'bodyWeight',
      '8310-5': 'bodyTemperature'
    }
  };

  constructor(private http: Http) { }

  public getData(): any {
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

  private getGroup(codings: any[]) {
    for (let i = 0; i < codings.length; i++) {
      let system = codings[i].system;
      let m = this.GROUPS[system];
      if (m) {
        let code = codings[i].code;
        let group = m[code];
        if (group) {
          return group;
        }
      }
    }
    console.log("ei grouppia", codings);
    return null;
  }

  private mapEntry(d: any): any {
    let code = d.code.coding[0].code;
    let group = this.getGroup(d.code.coding);
    return {
      group: group,
      x: d.effectiveDateTime,
      y: d.valueQuantity.value
    };
  }

  private isValidEntry(d: any): boolean {
    return d.valueQuantity && d.valueQuantity.value;
  }

  public getBundle(start: Date, end: Date) {
    return this.http.get('/assets/fhir/twoDays.json').map((d) => {
      let json = d.json();
      return json.entry
        .filter((d) => this.isValidEntry(d.resource))
        .map((d) => this.mapEntry(d.resource));
    });
  }

  public getMessages(start: Date, end: Date) {
    return this.http.get('/assets/messages.json').map((d) => {
      let json = d.json();
      return json;
    });
  }

  private limit(d: any): any {
    return {
      group: "limit",
      x: d.x,
      y: d.y
    };
  }

  public getLowerLimit(start: Date, end: Date) {
    return this.http.get('/assets/lowerLimit.json').map((d) => {
      let json = d.json();
      return json;
    });
  }

  public getUpperLimit(start: Date, end: Date) {
    return this.http.get('/assets/upperLimit.json').map((d) => {
      let json = d.json();
      return json;
    });
  }

}
