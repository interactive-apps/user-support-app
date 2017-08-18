import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs';


@Injectable()
export class UserService {

  private _rootDir: String;

  constructor(private http: Http, @Inject('rootDir') _rootDir: string) {
    this._rootDir = _rootDir;
  }


  // Get current user information
  getUserInformation () {
    return this.http.get(this._rootDir + 'api/me.json?fields=id,name,userGroups,userCredentials[userRoles[authorities]]')
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }

  getCurrentUserOrganizationUnits () {
    return this.http.get(this._rootDir + '/api/me/organisationUnits.json')
          .map((response: Response) => response.json())
          .catch(this.handleError);
  }

  getCurrentUserDatasets () {
    return this.http.get(this._rootDir + '/api/me/dataSets.json')
          .map((response: Response) => response.json())
          .catch(this.handleError);
  }


  private handleError (error: Response) {
    return Observable.throw(error || "Server Error");
  }
}