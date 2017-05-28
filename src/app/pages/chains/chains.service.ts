import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Settings } from '../../settings';
import { Globals } from '../../globals/globals';


@Injectable()
export class ChainsService {

  private uri: string;

  constructor(private http: Http) {
    this.uri = Settings.ENDPOINT + 'chains/';
  }

  getList() {
    return this.http.get(
      this.uri,
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
