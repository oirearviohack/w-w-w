import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/forkJoin'

@Injectable()
export class DataService {

  private GROUPS: any = {
    'http://loinc.org': {
      '8867-4': 'bpm',
      '3141-9': 'bodyWeight',
      '8302-2': 'bodyHeight',
      '8310-5': 'bodyTemperature'
    },
    'joku_muu': {
      '8867-4': 'bpm',
      '3141-9': 'bodyWeight',
      '8310-5': 'bodyTemperature'
    }
  };

  private UNITS: any = {
    'bpm': 'bpm',
    'bodyWeight': 'kg',
    'bodyHeight': 'cm',
    'bodyTemperature': 'C'
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
    let unit = this.UNITS[group] || '';
    let label = Number((d.valueQuantity.value).toFixed(0)) + ' ' + unit;
    return {
      group: group,
      x: d.effectiveDateTime,
      y: d.valueQuantity.value,
      label: {
        className: 'label-' + group,
        content: label,
        xOffset: -10,
        yOffset: -10
      }
    };
  }

  private isValidEntry(d: any): boolean {
    return d.valueQuantity && d.valueQuantity.value;
  }

  public getBundle2(start: Date, end: Date) {
    return this.http.get('/assets/fhir/twoDays.json').map((d) => {
      let json = d.json();
      return json.entry
        .filter((d) => this.isValidEntry(d.resource))
        .map((d) => this.mapEntry(d.resource));
    });
  }


  public getAll(start: Date, end: Date): Observable<any> {
      let b1: Observable<Response> = this.getBundleW2ESteps(start, end);
      let b2: Observable<Response> = this.getBundleW2EFHIR(start, end);
      let b3: Observable<Response> = this.getBundleW2ESleep(start, end);
      return Observable.forkJoin(b1, b2, b3).map((d) => {
        let allItems = [];
        for (let i=0; i<d.length; i++) {
          allItems = allItems.concat(d[i]);
        }
        return allItems;
      });
  }

  // public getBundleOda(start: Date, end: Date) {
  //   //let deltaDays = Math.ceil((end.getTime() - start.getTime())/(1000*60*60*24));
  //   let sy = start.getFullYear();
  //   let sm = start.getMonth() + 1;
  //   let sd = start.getDate();
  //   let sString = sy + '-' + sm + '-' + sd
  //
  //   let ey = end.getFullYear();
  //   let em = end.getMonth() + 1;
  //   let ed = end.getDate();
  //   let eString = ey + '-' + em + '-' + ed

  public getBundleOda(start: Date, end: Date): Observable<Response> {
    let deltaDays = Math.ceil((end.getTime() - start.getTime())/(1000*60*60*24));
    let y = start.getFullYear();
    let m = start.getMonth() + 1;
    let d = start.getDate();

    let headers: Headers = new Headers();
    //headers.append('Authorization', 'Bearer Uczu2IWSC2oHVwKWJb9lIQlLcpngUhsxZcMogW0vm3LfUZ14');
    headers.append('Accept', 'application/fhir+json');
    let user = 'czeuugwqowqdadxk'
    let sString = 'sss';
    let baseURI = 'https://oda.medidemo.fi'

    let params: URLSearchParams = new URLSearchParams();
    params.set('patient', 'Patient/601');
    //params.set('date', '<' + sString);

    let path = '/phr/baseDstu3/Observation?patient=Patient/601&date=' + sString //+ '&date=%3C%3D' + eString
    let uri = baseURI + path
    console.log(uri)

    return this.http.get(uri, {headers}).map((d) => {
      let json = d.json();
      return json.entry
        .filter((d) => this.isValidEntry(d.resource))
        .map((d) => this.mapEntry(d.resource));
      });
    }

    // W2E
    public getBundleW2EFHIR(start: Date, end: Date) {
      let deltaDays = Math.ceil((end.getTime() - start.getTime())/(1000*60*60*24));
      let y = start.getFullYear();
      let m = start.getMonth() + 1;
      let d = start.getDate();

      let headers: Headers = new Headers();
      //headers.append('Authorization', 'Bearer Uczu2IWSC2oHVwKWJb9lIQlLcpngUhsxZcMogW0vm3LfUZ14');
      headers.append('Accept', 'application/json');
      let user = 'czeuugwqowqdadxk'

      let w2eBaseURI = 'https://developer.w2e.fi'
      let w2ePath = '/api/fhir/users/' + user + '/bundle/' + y + '/' + m + '/' + d + '/days/' + deltaDays
      let uri = 'http://localhost:3000/w2e?path=' + w2ePath
      console.log(uri)

      return this.http.get(uri, {headers}).map((d) => {
        let json = d.json();
        return json.entry
          .filter((d) => this.isValidEntry(d.resource))
          .map((d) => this.mapEntry(d.resource));
        });
      }



      // W2E
      public getBundleW2ESteps(start: Date, end: Date) {
        let deltaDays = Math.ceil((end.getTime() - start.getTime())/(1000*60*60*24));
        let y = start.getFullYear();
        let m = start.getMonth() + 1;
        let d = start.getDate();
        let headers: Headers = new Headers();
        //headers.append('Authorization', 'Bearer Uczu2IWSC2oHVwKWJb9lIQlLcpngUhsxZcMogW0vm3LfUZ14');
        headers.append('Accept', 'application/json');

        let w2eBaseURI = 'https://developer.w2e.fi'
        let w2ePath = '/api/users/czeuugwqowqdadxk/activity/' + y + '/' + m + '/' + d + '/days/' + deltaDays
//        let w2ePath = '/api/fhir/users/' + user + '/bundle/' + y + '/' + m + '/' + d + '/days/' + deltaDays
        let uri = 'http://localhost:3000/w2e?path=' + w2ePath
        console.log(uri)

        return this.http.get(uri, {headers}).map((d) => {
          let json = d.json();
          return json

            .filter((dd) => dd['activity'][0]['steps'] && dd['activity'][0]['steps'] != 0)
            //.map((d) => this.mapEntry(d.resource))
            .map((dd) => {
              let steps = dd['activity'][0]['steps'];
              let dat = new Date(dd['date']);
              dat.setHours(12);
              return {group: 'dailySteps',
                                  x: dat,
                                  y: steps / 100,
                                  label: {
                                          className: 'label-dailySteps',
                                          content: steps,
                                          xOffset: -10,
                                          yOffset: -10}}});
          });
        }


        //public getBundle(start: Date, end: Date) {
        public getBundleW2ESleep(start: Date, end: Date) {
          let deltaDays = Math.ceil((end.getTime() - start.getTime())/(1000*60*60*24));
          let y = start.getFullYear();
          let m = start.getMonth() + 1;
          let d = start.getDate();
          let headers: Headers = new Headers();
          //headers.append('Authorization', 'Bearer Uczu2IWSC2oHVwKWJb9lIQlLcpngUhsxZcMogW0vm3LfUZ14');
          headers.append('Accept', 'application/json');

          let w2eBaseURI = 'https://developer.w2e.fi'
          let w2ePath = '/api/users/czeuugwqowqdadxk/sleep/' + y + '/' + m + '/' + d + '/days/' + deltaDays
  //        let w2ePath = '/api/fhir/users/' + user + '/bundle/' + y + '/' + m + '/' + d + '/days/' + deltaDays
          let uri = 'http://localhost:3000/w2e?path=' + w2ePath
          console.log(uri)

          return this.http.get(uri, {headers}).map((d) => {
            let json = d.json();
            return json
              .filter((dd) => dd['sleep'][0])
              //.map((d) => this.mapEntry(d.resource))
              .map((dd) => {
                let sleep = dd['sleep'][0]['minutesAsleep'];
                return {group: 'sleep',
                                    x: dd['date'],
                                    y: sleep / 4,
                                    label: {
                                          className: 'label-sleep',
                                          content: sleep + " min",
                                            xOffset: -10,
                                            yOffset: -10}}});
            });
          }




  public getMessages(start: Date, end: Date) {
    return this.http.get('/assets/messages.json').map((d) => {
      let json = d.json();
      return json;

    });
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
