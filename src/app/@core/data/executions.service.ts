import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Settings } from '../settings';
import { Execution } from '../models'
import { map } from 'rxjs/operators';


@Injectable()
export class ExecutionsService {
  private uri: string;

  constructor(private http: HttpClient) {
    this.uri = `${Settings.EXECUTIONS_ENDPOINT}executions/`;
  }

  getList(filter) {
    const search = new HttpParams();

    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        search.append(key, filter[key]);
      }
    }

    return this.http.get(this.uri, {params: search}).pipe(
      map(
        (res: Response) => ExecutionsService.deserializeList(res.json()['results'])
      )
    );
  }

  get(id: number) {
    return this.http.get(
      `${this.uri}${id}/`
    ).pipe(
      map(
        (res: Response) => ExecutionsService.deserialize(res.json())
      )
    );
  }

  private static deserializeList(list: object[]): Execution[] {
    const serialized: Execution[] = [];
    for (const o of list) {
      serialized.push(ExecutionsService.deserialize(o));
    }
    return serialized;
  }

  private static deserialize(o: object): Execution {
    return new Execution(
      o['execution_id'],
      o['chain_identifier'],
      o['start'],
      o['end'],
      o['status']['name'],
      o['reason']
    );
  }
}
