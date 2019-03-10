import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../settings';
import { DataType } from '../models'
import { map } from 'rxjs/operators';


@Injectable()
export class DataTypesService {
  private uri: string;

  constructor(private http: HttpClient) {
    this.uri = `${Settings.CONFIGURATION_ENDPOINT}data-types/`;
  }

  getList() {
    return this.http.get(this.uri).pipe(
      map(
        (res: Response) => DataTypesService.deserializeList(res.json()['results'])
      )
    );
  }

  get(id: number) {
    return this.http.get(
      `${this.uri}${id}/`
    ).pipe(
      map(
        (res: Response) => DataTypesService.deserialize(res.json())
      )
    );
  }

  private static deserializeList(list: object[]): DataType[] {
    const serialized: DataType[] = [];
    for (const o of list) {
      serialized.push(DataTypesService.deserialize(o));
    }
    return serialized;
  }

  private static deserialize(o: object): DataType {
    return new DataType(
      o['id'],
      o['name']
    );
  }

}
