import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs';


@Injectable()
export class OrganisationUnitsService {

  private baseUrl: String;
  public options: any;

  constructor(private http: Http, @Inject('rootDir') private _rootDir: String) {
    this.baseUrl = _rootDir;
    let jsonHeaders = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    this.options = new RequestOptions({ headers: jsonHeaders }); // Create a request option
  }


  // Get current user information
  getOrganisationUnit(orgUnitID: Number | String) {
    return this.http.get(`${this.baseUrl}api/organisationUnits/${orgUnitID}.json?fields=id,name,dataSets=[id,name,periodType]`)
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }

  updatedOrgUnitdatasets(orgUnitID: String, payload: any) {
    return this.http.patch(`${this.baseUrl}api/organisationUnits/${orgUnitID}`, payload, this.options)
        .map((response: Response) => response)
        .catch( this.handleError );
  }

  private handleError (error: Response) {
    return Observable.throw(error || "Server Error");
  }
}
