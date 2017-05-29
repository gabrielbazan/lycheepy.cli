import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { RequestOptions, Headers } from '@angular/http';
import { Settings } from '../settings';
import { Globals } from '../globals/globals';


@Injectable()
export class AuthenticationService {
  private uri: string;
  private globals: Globals;

  constructor(private http: Http) {
    this.uri = `${Settings.API_ENDPOINT}tokens/`;
    this.globals = Globals.getInstance();
  }

  authenticate(user: string, password: string) {
    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa(user + ':' + password));

    const options = new RequestOptions({ headers });

    const request = this.http.post(this.uri, null, options);

    request.subscribe(
      data => {
        const response = data.json();
        this.globals.setToken(response.key);
        this.globals.setUser(response.user);
      },
      err => console.error(err),
      () => console.log('Authentication finished'),
    );

    return request;
  }

}
