import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../settings';
import { map } from 'rxjs/operators';
import { Repository } from '../models';


@Injectable()
export class RepositoriesService {

  private readonly uri: string;

  constructor(private  http:  HttpClient) {
    this.uri = `${Settings.CONFIGURATION_ENDPOINT}repositories`;
  }

  getList() {
    return this.http.get(this.uri).pipe(
      map( response => {
          return response['results'];
        }
      )
    );
  }

  create(data: Repository) {
    return this.http.post(this.uri, data);
  }

  get(identifier) {
    return this.http.get(`${this.uri}/${identifier}`);
  }

  update(identifier, data: Repository) {
    return this.http.put(`${this.uri}/${identifier}`, data);
  }
}
