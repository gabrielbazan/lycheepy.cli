import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Settings } from '../../settings';
import { Globals } from '../../globals/globals';


@Injectable()
export class ExecutionsService {

  private uri: string;

  constructor(private http: Http) {
    this.uri = Settings.API_ENDPOINT + 'executions/';
  }

  getList(filter) {

    const search = new URLSearchParams();

    for(let key in filter) {
      search.set(key, filter[key]);
    }

    const options = new RequestOptions(
      { search },
    );

    return this.http.get(
      this.uri,
      options
      // {
      //  headers: Globals.getInstance().getTokenHeader(),
      // },
    );
  }

  get(id: number) {
    return this.http.get(
      this.uri + id + '/',
      // { headers: Globals.getInstance().getTokenHeader() },
    );
  }
}
