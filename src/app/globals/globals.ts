import { Headers } from '@angular/http';


export class Globals {

  static instance: Globals;
  static isCreating: Boolean = false;

  private token: string;
  private tokenHeader: Headers;
  private user: object;


  constructor() {
    if (!Globals.isCreating) {
      throw new Error('Use the getInstance method');
    }
  }

  static getInstance() : Globals {
    if (Globals.instance == null) {
      Globals.isCreating = true;
      Globals.instance = new Globals();
      Globals.isCreating = false;
    }

    return Globals.instance;
  }

 getToken(): string {
    return this.token;
 }

  setToken(token: string): void {
    this.token = token;

    this.tokenHeader = new Headers();
    this.tokenHeader.append('Authorization', 'Token ' + this.token);
  }

  getTokenHeader(): Headers {
    return this.tokenHeader;
  }

  getUser(): object {
    return this.user;
  }

  setUser(user: object) {
    this.user = user;
  }

}
