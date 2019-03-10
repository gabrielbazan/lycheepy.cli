import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Settings } from '../settings';
import * as xml2js from 'xml2js';
import * as xmlbuilder from 'xmlbuilder';
import { map } from 'rxjs/operators';


@Injectable()
export class WpsService {
  private uri: string;

  constructor(private http: HttpClient) {
    this.uri = Settings.WPS_ENDPOINT;
  }

  getCapabilities() {
    const search = new HttpParams();

    search.append('service', 'WPS');
    search.append('request', 'getcapabilities');

    return this.http.get(this.uri, {params: search, responseType: 'text'}).pipe(
      map(response => {
        let res;
        xml2js.parseString( response, function (err, result) {
          res = result;
        });
        return res;
      })
    );
  }

  describeProcess(identifier: string) {
    const search = new HttpParams();

    search.append('service', 'WPS');
    search.append('request', 'describeprocess');
    search.append('version', '1.0.0');
    search.append('identifier', identifier);

    return this.http.get(this.uri, {params: search, responseType: 'text'}).pipe(
      map(response => {
        let res;
        xml2js.parseString( response, function (err, result) {
          res = result;
        });
        return res;
      })
    );
  }

  execute(identifier: string, literalInputs, complexInputs) {

    const inputObjects: any = [];

    for (const input of literalInputs) {
      inputObjects.push(
        {
          'wps:Input': {
            'ows:Identifier': {
              '#text': input.identifier,
            },
            'wps:Data': {
              'wps:LiteralData': {
                '#text': input.value,
              },
            },
          },
        },
      );
    }

    for (const input of complexInputs) {
      inputObjects.push(
        {
          'wps:Input': {
            'ows:Identifier': {
              '#text': input.identifier,
            },
            'wps:Reference': {
              '@xlink:href': input.value
            },
          },
        },
      );
    }

    const xmlObject = xmlbuilder.create(
      {
        'wps:Execute': {
          '@service': 'WPS',
          '@version': '1.0.0',
          '@xmlns:wps': 'http://www.opengis.net/wps/1.0.0',
          '@xmlns:ows': 'http://www.opengis.net/ows/1.1',
          '@xmlns:xlink': 'http://www.w3.org/1999/xlink',
          '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          '@xsi:schemaLocation': 'http://www.opengis.net/wps/1.0.0 ../wpsExecute_request.xsd',
          'ows:Identifier': {
            '#text': identifier,
          },
          'wps:ResponseForm': {
            'wps:ResponseDocument': {
              '@storeExecuteResponse': 'true',
              '@status': 'true',
            }
          },
          'wps:DataInputs': inputObjects,
        },
      },
      { encoding: 'utf-8', standalone: 'yes' },
    );

    const xml = xmlObject.end({ pretty: true });

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'text/xml');

    return this.http.post(this.uri, xml, {headers: headers, responseType: 'text'}).pipe(
      map(response => {
        let res;
        xml2js.parseString( response, function (err, result) {
          res = result;
        });
        return res;
      })
    );
  }

}
