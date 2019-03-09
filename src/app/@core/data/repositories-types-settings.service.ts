import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../settings';
import { map } from 'rxjs/operators';


@Injectable()
export class RepositoriesTypesSettingsService {

  private readonly uri: string;

  constructor(private  httpClient:  HttpClient) {
    this.uri = `${Settings.CONFIGURATION_ENDPOINT}repositories-types-settings`;
  }

  get() {
    return this.httpClient.get(this.uri);
  }

}
