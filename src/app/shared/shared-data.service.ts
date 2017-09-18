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

  sendMultipleAsyncRequests(payload:any){
    let arrayTosend = [];

    if (_.isArray(payload)) {
      arrayTosend = _.transform(payload,(result, obj)=>{
        let url = `${this.baseUrl}${obj.url}`;
        let requestObj = this.returnObservable(url, obj);
        result.push(requestObj);
      },[])
    } else {

      let url = `${this.baseUrl}${payload.url}`;
      let requestObj = this.returnObservable(url,payload)
      arrayTosend.push(requestObj);
    }

    return Observable.forkJoin(arrayTosend);
  }


  private handleError (error: Response) {
    return Observable.throw(error || "Server Error");
  }


  private returnObservable(url,obj){
    if(obj.method.toLowerCase() == 'put'){
      return this.http.put(url, obj.payload, this.options).map(res => res.json());
    }else if (obj.method.toLowerCase() == 'post'){
      return this.http.post(url, obj.payload, this.options).map(res => res.json());
    }else if (obj.method.toLowerCase() == 'patch'){
      return this.http.patch(url, obj.payload, this.options).map(res => res.json());
    }
  }
}
