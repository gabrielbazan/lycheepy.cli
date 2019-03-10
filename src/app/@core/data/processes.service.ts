import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Settings } from '../settings';
import { Process, Input, Output } from '../models'
import { map } from 'rxjs/operators';


@Injectable()
export class ProcessesService {
  private uri: string;

  constructor(private http: HttpClient) {
    this.uri = `${Settings.CONFIGURATION_ENDPOINT}processes/`;
  }

  getList(filter) {
    const search = new HttpParams();

    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        search.append(key, filter[key]);
      }
    }

    return this.http.get(this.uri, { params: search }).pipe(
      map(
        (res: Response) => ProcessesService.deserializeList(res.json()['results'])
      )
    );
  }

  get(id: number) {
    return this.http.get(
      `${this.uri}${id}/`
    ).pipe(
      map(
        (res: Response) => ProcessesService.deserialize(res.json())
      )
    );
  }

  create(process: object, file: any) {

    const data = new FormData();

    data.append('specification', JSON.stringify(process));
    data.append('file', file);

    return this.http.post(
      this.uri,
      data
    ).pipe(
      map(
        (res: Response) => ProcessesService.deserialize(res.json())
      )
    );
  }

  update(id: number, properties: object) {
    return this.http.put(
      `${this.uri}${id}/`,
      properties,
    ).pipe(
      map(
        (res: Response) => ProcessesService.deserialize(res.json())
      )
    );
  }

  private static deserializeList(list: object[]): Process[] {
    const serialized: Process[] = [];
    for (const o of list) {
      serialized.push(ProcessesService.deserialize(o));
    }
    return serialized;
  }

  private static deserialize(o: object): Process {
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
