import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs';

const USERSUPPORTAPPPAYLOAD = 'UserSupportApp';

@Injectable()
export class DataStoreService {

  private baseUrl: String;
  public options: any;

  constructor(private http: Http, @Inject('rootDir') private _rootDir: String) {

    this.baseUrl = _rootDir;
    let jsonHeaders = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    this.options = new RequestOptions({ headers: jsonHeaders }); // Create a request option

  }

  // Get all namespace in the given system.
  getAllDataStoreNameSpace() {
    return this.http.get(`${this.baseUrl}api/dataStore`)
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }

  // Get all keys in a given namespace
  getAllKeysDataStoreNamespace(namespace: string) {
    return this.http.get(`${this.baseUrl}api/dataStore/${namespace}.json`)
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }

  // Get Value of given namespace key
  getValuesOfDataStoreNamespaceKeys(key: string) {
    return this.http.get(`${this.baseUrl}api/dataStore/${USERSUPPORTAPPPAYLOAD}/${key}.json`)
      .map((response: Response) => response.json())
      .catch( this.handleError );
  }


  createNewKeyAndValue(key: string, payload: any) {
    return this.http.post(`${this.baseUrl}api/dataStore/${USERSUPPORTAPPPAYLOAD}/${key}`, payload, this.options)
        .map((response: Response) => response)
        .catch( this.handleError );
  }



  private handleError (error: Response) {
    return Observable.throw(error || "Server Error");
  }
}
