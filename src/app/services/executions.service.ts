import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Settings } from '../settings';
import { Execution } from '../models'


@Injectable()
export class ExecutionsService {
  private uri: string;

  constructor(private http: Http) {
    this.uri = `${Settings.EXECUTIONS_ENDPOINT}executions/`;
  }

  getList(filter) {
    const search = new URLSearchParams();

    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        search.set(key, filter[key]);
      }
    }

    return this.http.get(this.uri, new RequestOptions({ search })).map(
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

  private deserializeList(list: object[]): Execution[] {
    const serialized: Execution[] = [];
    for (const o of list) {
      serialized.push(this.deserialize(o));
    }
    return serialized;
  }

  private deserialize(o: object): Execution {
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
