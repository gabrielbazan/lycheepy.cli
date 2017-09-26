import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Settings } from '../settings';
import * as xml2js from 'xml2js';
import * as xmlbuilder from 'xmlbuilder';


@Injectable()
export class WpsService {
  private uri: string;

  constructor(private http: Http) {
    this.uri = Settings.WPS_ENDPOINT;
  }

  getCapabilities() {
    const search = new URLSearchParams();

    search.set('service', 'WPS');
    search.set('request', 'getcapabilities');

    const options = new RequestOptions({ search });

    return this.http.get(this.uri, options).map(response => {
      let res;
      xml2js.parseString( response.text(), function (err, result) {
        res = result;
      });
      return res;
    });
  }

  describeProcess(identifier: string) {
    const search = new URLSearchParams();

    search.set('service', 'WPS');
    search.set('request', 'describeprocess');
    search.set('version', '1.0.0');
    search.set('identifier', identifier);

    const options = new RequestOptions({ search });

    return this.http.get(this.uri, options).map(response => {
      let res;
      xml2js.parseString( response.text(), function (err, result) {
        res = result;
      });
      return res;
    });
  }

  execute(identifier: string, inputsValues) {

    const inputObjects: any = [];

    for (const input of inputsValues) {
      // TODO: Support ComplexData
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
          'wps:DataInputs': inputObjects,
        },
      },
      { encoding: 'utf-8', standalone: 'yes' },
    );

    const xml = xmlObject.end({ pretty: true });

    const headers = new Headers();
    headers.append('Content-Type', 'text/xml');
    const options = new RequestOptions({ headers });

    return this.http.post(this.uri, xml, options).map(response => {
      let res;
      xml2js.parseString( response.text(), function (err, result) {
        res = result;
      });
      return res;
    });
  }

}
