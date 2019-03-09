import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../settings';
import { map } from 'rxjs/operators';


@Injectable()
export class RepositoriesService {

  private readonly uri: string;

  constructor(private  httpClient:  HttpClient) {
    this.uri = `${Settings.CONFIGURATION_ENDPOINT}repositories`;
  }

  getList() {
    return this.httpClient.get(this.uri).pipe(
      map( response => {
          return response['results'];
        }
      )
    );
  }

  create(data) {
    return this.httpClient.post(this.uri, data);
  }

  update(identifier, data) {
    return this.httpClient.put(`${this.uri}/${identifier}`, data);
  }
}
