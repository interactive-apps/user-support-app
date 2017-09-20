import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import 'rxjs/Rx';
import * as _ from 'lodash';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';


@Injectable()
export class SharedDataService {

  private baseUrl: String;
  private options: any;

  constructor(private http: Http, @Inject('rootDir') _rootDir: string) {
    this.baseUrl = _rootDir;
    let jsonHeaders = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    this.options = new RequestOptions({ headers: jsonHeaders }); // Create a request option
  }

  // Get current user information
  getSystemConfiguration () {
    return this.http.get(this.baseUrl + 'api/configuration.json')
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }


  // Get current user information
  getSystemSetting () {
    return this.http.get(this.baseUrl + 'api/systemSetting.json')
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }


  // Get current user information
  getFeedbackReceipients () {
    return this.http.get(this.baseUrl + 'api/configuration/feedbackRecipients.json')
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }

  // Generic put request
  genericPutRequest (url:string, payload:any) {
    return this.http.put(this.baseUrl + url,payload, this.options)
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }

  // Generic post request
  genericPostRequest (url:string, payload:any) {
    return this.http.post(this.baseUrl + url,payload, this.options)
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }

  private handleError (error: Response) {
    return Observable.throw(error || "Server Error");
  }

}
