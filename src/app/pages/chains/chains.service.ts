import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Settings } from '../../settings';
import { Globals } from '../../globals/globals';


@Injectable()
export class ChainsService {

  chains = [
    {
      'identifier': 'ComplexChain11',
      'title': 'A complex chain',
      'abstract': 'A chain',
      'version': '0.1',
      'metadata': ['chain'],
      'steps': [
        {
          'before': 'A',
          'after': 'C',
          'match': [
            {
              'output': 'plus',
              'input': 'number1',
            },
          ],
          'publish': ['plus'],
        },
        {
          'before': 'B',
          'after': 'C',
          'match': [
            {
              'output': 'plus',
              'input': 'number2',
            },
          ],
        },
        { 'before': 'C', 'after': 'D', 'match': [{ 'output': 'multiplied', 'input': 'number' }] },
        { 'before': 'C', 'after': 'E', 'match': [{ 'output': 'divided', 'input': 'number' }] },
        { 'before': 'D', 'after': 'F', 'match': [{ 'output': 'multipliedD', 'input': 'number' }] },
        { 'before': 'E', 'after': 'F' },
        { 'before': 'F', 'after': 'G', 'match': [{ 'output': 'plus', 'input': 'number' }] },
      ],
      'extraOutputs': [
        { 'process': 'C', 'output': 'multiplied' },
      ],
    },
  ];

  private uri: string;

  constructor(private http: Http) {
    this.uri = Settings.ENDPOINT + 'chains/';
  }

  getList() {
    return this.http.get(
      this.uri,
      // {
      //  headers: Globals.getInstance().getTokenHeader(),
      // },
    );
  }

  get(id: number) {
    return this.http.get(
      this.uri + id,
      { headers: Globals.getInstance().getTokenHeader() },
    );
  }
}
