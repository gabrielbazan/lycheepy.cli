import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Settings } from '../settings';
import { Chain, Step } from '../models'


@Injectable()
export class ChainsService {
  private uri: string;

  constructor(private http: Http) {
    this.uri = `${Settings.CONFIGURATION_ENDPOINT}chains/`;
  }

  getList() {
    return this.http.get(
      this.uri
    ).map(
      (res: Response) => this.deserializeList(res.json().results)
    );
  }

  get(id: number) {
    return this.http.get(
      `${this.uri}${id}/`
    ).map(
      (res: Response) => this.deserialize(res.json())
    );
  }

  update(id: number, properties: object) {
    return this.http.put(
      `${this.uri}${id}/`,
      properties,
    ).map(
      (res: Response) => this.deserialize(res.json())
    );
  }

  private deserializeList(list: object[]): Chain[] {
    const serialized: Chain[] = [];
    for (const o of list) {
      serialized.push(this.deserialize(o));
    }
    return serialized;
  }

  private deserialize(o: object): Chain {
    return new Chain(
      o['id'],
      o['identifier'],
      o['title'],
      o['abstract'],
      o['version'],
      <string[]> o['metadata'],
      <Step[]> o['steps'],
      o['publish']
    );
  }
}
