import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs';


@Injectable()
export class UserService {

  private _rootDir: String;
  private options: any;

  constructor(private http: Http, @Inject('rootDir') _rootDir: string) {
    this._rootDir = _rootDir;
    let jsonHeaders = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    this.options = new RequestOptions({ headers: jsonHeaders }); // Create a request option
  }


  // Get current user information
  getUserInformation () {
    return this.http.get(this._rootDir + 'api/me.json?fields=id,name,userGroups')
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }


  // Get current user information
  getUser(userId:string, filters?:string) {
    return this.http.get(`${this._rootDir}api/users/${userId}.json?${filters}`)
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }

  updateUser(userId:string, payload:any){
    return this.http.put(`${this._rootDir}api/users/${userId}`,payload,this.options)
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }

  getCurrentUserOrganizationUnits () {
    return this.http.get(this._rootDir + 'api/me/organisationUnits.json')
          .map((response: Response) => response.json())
          .catch(this.handleError);
  }

  getCurrentUserDatasets () {
    return this.http.get(this._rootDir + 'api/me/dataSets.json?fields=forms')
          .map((response: Response) => response.json())
          .catch(this.handleError);
  }


  getAllUsers (filters?:string) {
    let loadFilter = filters ? filters: '';
    return this.http.get(`${this._rootDir}api/users.json?paging=false&${loadFilter}`)
          .map((response: Response) => response.json())
          .catch(this.handleError);
  }

  getAllUserGroups () {
    return this.http.get(this._rootDir + 'api/userGroups.json?paging=false')
          .map((response: Response) => response.json())
          .catch(this.handleError);
  }

  getAllUserRoles () {
    return this.http.get(this._rootDir + 'api/userRoles.json?paging=false')
          .map((response: Response) => response.json())
          .catch(this.handleError);
  }

  private handleError (error: Response) {
    return Observable.throw(error || "Server Error");
  }
}
