import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Settings } from '../settings';
import { Process, Input, Output } from '../models'


@Injectable()
export class ProcessesService {
  private uri: string;

  constructor(private http: Http) {
    this.uri = `${Settings.CONFIGURATION_ENDPOINT}processes/`;
  }

  getList(filter) {
    const search = new URLSearchParams();

    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        search.set(key, filter[key]);
      }
    }

    return this.http.get(
      this.uri, new RequestOptions({ search })
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

  private deserializeList(list: object[]): Process[] {
    const serialized: Process[] = [];
    for (const o of list) {
      serialized.push(this.deserialize(o));
    }
    return serialized;
  }

  private deserialize(o: object): Process {
    return new Process(
      o['id'],
      o['identifier'],
      o['title'],
      o['abstract'],
      o['version'],
      <string[]> o['metadata'],
      <Input[]> o['inputs'],
      <Output[]> o['outputs']
    );
  }
}
