import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs';


@Injectable()
export class DataSetsService {

  private baseUrl: String;
  public options: any;

  constructor(private http: Http, @Inject('rootDir') private _rootDir: String) {

    this.baseUrl = _rootDir;
    let jsonHeaders = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    this.options = new RequestOptions({ headers: jsonHeaders }); // Create a request option

  }

  // Get all datasets for the system
  getAllDataSets() {
    return this.http.get(`${this.baseUrl}api/dataSets.json?fields=:all&paging=false`)
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }

  // get specific dataset information
  getDataSets(dataSetID: Number | String) {
    return this.http.get(`${this.baseUrl}api/dataSets/${dataSetID}.json`)
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }

  updatedDataSetsOrgUnits(dataSetID: String, payload: any) {
    return this.http.put(`${this.baseUrl}api/dataSets/${dataSetID}`, payload, this.options)
        .map((response: Response) => response)
        .catch( this.handleError );
  }

  private handleError (error: Response) {
    return Observable.throw(error || "Server Error");
  }
}
