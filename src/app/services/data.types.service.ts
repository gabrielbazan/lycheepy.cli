import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Settings } from '../settings';
import { DataType } from '../models'


@Injectable()
export class DataTypesService {
  private uri: string;

  constructor(private http: Http) {
    this.uri = `${Settings.CONFIGURATION_ENDPOINT}data-types/`;
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

  private deserializeList(list: object[]): DataType[] {
    const serialized: DataType[] = [];
    for (const o of list) {
      serialized.push(this.deserialize(o));
    }
    return serialized;
  }

  private deserialize(o: object): DataType {
    return new DataType(
      o['id'],
      o['name']
    );
  }

}
