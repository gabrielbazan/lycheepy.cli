import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../settings';
import { Format } from '../models'
import { map } from 'rxjs/operators';


@Injectable()
export class FormatsService {
  private uri: string;

  constructor(private http: HttpClient) {
    this.uri = `${Settings.CONFIGURATION_ENDPOINT}formats/`;
  }

  getList() {
    return this.http.get(this.uri).pipe(
      map(
        response => FormatsService.deserializeList(response['results'])
      )
    );
  }

  get(id: number) {
    return this.http.get(
      `${this.uri}${id}/`
    ).pipe(
      map(
        response => FormatsService.deserialize(response)
      )
    );
  }

  private static deserializeList(list: object[]): Format[] {
    const serialized: Format[] = [];
    for (const o of list) {
      serialized.push(FormatsService.deserialize(o));
    }
    return serialized;
  }

  private static deserialize(o: object): Format {
    return new Format(
      o['id'],
      o['name'],
      o['mime_type'],
      o['extension']
    );
  }

}
