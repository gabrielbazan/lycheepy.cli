import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../settings';
import { map } from 'rxjs/operators';
import { Chain, Input, Output, Step } from '../models';


@Injectable()
export class ChainsService {
  private uri: string;

  constructor(private http: HttpClient) {
    this.uri = `${Settings.CONFIGURATION_ENDPOINT}chains/`;
  }

  getList() {
    return this.http.get(
      this.uri
    ).pipe(
      map(
        (res: Response) => ChainsService.deserializeList(res.json()['results'])
      )
    );
  }

  get(id: number) {
    return this.http.get(
      `${this.uri}${id}/`
    ).pipe(
      map(
        (res: Response) => ChainsService.deserialize(res.json())
      )
    );
  }

  create(properties: object) {
    return this.http.post(
      this.uri,
      properties,
    ).pipe(
      map(
        (res: Response) => ChainsService.deserialize(res.json())
      )
    );
  }

  update(id: number, properties: object) {
    return this.http.put(
      `${this.uri}${id}/`,
      properties,
    ).pipe(
      map(
        (res: Response) => ChainsService.deserialize(res.json())
      )
    );
  }

  private static deserializeList(list: object[]): Chain[] {
    const serialized: Chain[] = [];
    for (const o of list) {
      serialized.push(ChainsService.deserialize(o));
    }
    return serialized;
  }

  private static deserialize(o: object): Chain {
    return new Chain(
      o['id'],
      o['identifier'],
      o['title'],
      o['abstract'],
      o['version'],
      <string[]> o['metadata'],
      <Input[]> o['inputs'],
      <Output[]> o['outputs'],
      <Step[]> o['steps'],
      o['publish']
    );
  }
}
