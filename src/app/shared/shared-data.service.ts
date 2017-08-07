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

  


  private handleError (error: Response) {
    return Observable.throw(error || "Server Error");
  }
}
