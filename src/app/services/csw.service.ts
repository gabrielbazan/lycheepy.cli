import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { RequestOptions, Headers } from '@angular/http';
import { Settings } from '../settings';
import * as xml2js from 'xml2js';
import * as xmlbuilder from 'xmlbuilder';


@Injectable()
export class CswService {
  private uri: string;

  constructor(private http: Http) {
    this.uri = `${Settings.REPOSITORY_ENDPOINT}csw/`;
  }

  // TODO: Handle with Object XML, like WPS Service Execute
  getExecutionResults(executionId: string) {
    const sl = 'http://www.opengis.net/cat/csw/2.0.2 http://schemas.opengis.net/csw/2.0.2/CSW-discovery.xsd';

    const xmlObject = xmlbuilder.create(
      {
        'csw:GetRecords': {
          '@service': 'CSW',
          '@version': '2.0.2',
          '@resultType': 'results',
          '@startPosition': '1',
          '@maxRecords': '10',
          '@outputFormat': 'application/xml',
          '@outputSchema': 'http://www.opengis.net/cat/csw/2.0.2',
          '@xmlns:csw': 'http://www.opengis.net/cat/csw/2.0.2',
          '@xmlns:ogc': 'http://www.opengis.net/ogc',
          '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          '@xsi:schemaLocation': sl,
          '@xmlns:gmd': 'http://www.isotc211.org/2005/gmd',
          '@xmlns:apiso': 'http://www.opengis.net/cat/csw/apiso/1.0',

          'csw:Query': {
            '@typeNames': 'csw:Record',
            'csw:ElementSetName': {
              '#text': 'full'
            },
            'csw:Constraint': {
              '@version': '1.1.0',
              'ogc:Filter': {
                'ogc:PropertyIsLike': {
                  '@matchCase': 'false',
                  '@wildCard': '%',
                  '@singleChar': '_',
                  '@escapeChar': '\\',
                  'ogc:PropertyName': {
                    '#text': 'dc:title'
                  },
                  'ogc:Literal': {
                    '#text': `%${executionId}%`
                  }
                }
              }
            }
          }
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
