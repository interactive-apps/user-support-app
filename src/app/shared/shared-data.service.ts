import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs';


@Injectable()
export class SharedDataService {

  private _rootDir: String;

  constructor(private http: Http, @Inject('rootDir') _rootDir: string) {
    this._rootDir = _rootDir;
  }

  // Get current user information
  getSystemConfiguration () {
    return this.http.get(this._rootDir + 'api/configuration.json')
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }


  // Get current user information
  getSystemSetting () {
    return this.http.get(this._rootDir + 'api/systemSetting.json')
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }


  // Get current user information
  getFeedbackReceipients () {
    return this.http.get(this._rootDir + 'api/configuration/feedbackRecipients.json')
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }



  private handleError (error: Response) {
    return Observable.throw(error || "Server Error");
  }
}
