import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Settings } from '../settings';


@Injectable()
export class ExecutionsService {
  private uri: string;

  constructor(private http: Http) {
    this.uri = `${Settings.API_ENDPOINT}executions/`;
  }

  getList(filter) {
    const search = new URLSearchParams();

    for(let key in filter) {
      search.set(key, filter[key]);
    }

    return this.http.get(this.uri, new RequestOptions({ search }));
  }

  get(id: number) {
    return this.http.get(
      `${this.uri}${id}/`
    );
  }
}
