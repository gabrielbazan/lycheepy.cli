import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Settings } from '../settings';
import { Format } from '../models'


@Injectable()
export class FormatsService {
  private uri: string;

  constructor(private http: Http) {
    this.uri = `${Settings.CONFIGURATION_ENDPOINT}formats/`;
  }

  getList() {
    return this.http.get(this.uri).map(
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

  private deserializeList(list: object[]): Format[] {
    const serialized: Format[] = [];
    for (const o of list) {
      serialized.push(this.deserialize(o));
    }
    return serialized;
  }

  private deserialize(o: object): Format {
    return new Format(
      o['id'],
      o['name'],
      o['mime_type'],
      o['extension']
    );
  }

}
