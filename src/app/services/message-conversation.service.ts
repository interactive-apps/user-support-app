import { Injectable, Inject } from '@angular/core';
import { MessageConversation } from '../models/message-conversation.model';
import { Message } from '../models/message.model';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class MessageConversationService {
  messageConversation: Observable<MessageConversation[]>;
  pager: Observable<any>;
  options: any;
  private _messageConversation: BehaviorSubject<MessageConversation[]>;
  private _pager: BehaviorSubject<any>;
  private baseUrl: string;
  private dataStore: {
    messageConversation: MessageConversation[]
  };


  constructor(private http: Http, @Inject('rootDir') private _rootDir: string) {
    this.baseUrl = _rootDir;
    this.dataStore = { messageConversation: [] };
    this._messageConversation = <BehaviorSubject<MessageConversation[]>>new BehaviorSubject([]);
    this._pager = <BehaviorSubject<any>>new BehaviorSubject({});
    this.messageConversation = this._messageConversation.asObservable();
    this.pager = this._pager.asObservable();
    let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    this.options = new RequestOptions({ headers: headers }); // Create a request option
  }

  //this loads all messageConversation

  loadAll(pageNumber?: Number | String) {

    let pageNo = pageNumber ? pageNumber : 1;
    this.http.get(`${this.baseUrl}api/messageConversations?fields=*,messages[*]&page=${pageNo}&pageSize=20`).map(response => response.json()).subscribe(result => {
      this._pager.next(Object.assign({}, result).pager);
      console.log(result)
      this.dataStore.messageConversation = result.messageConversations;
      this._messageConversation.next(Object.assign({}, this.dataStore).messageConversation);
    }, error => this.handleError(error));
  }


  load(id: number | string) {
    this.http.get(`${this.baseUrl}api/messageConversations/${id}`).map(response => response.json()).subscribe(data => {
      let notFound = true;

      this.dataStore.messageConversation.forEach((item, index) => {
        if (item.id === data.id) {
          this.dataStore.messageConversation[index] = data;
          notFound = false;
        }
      });

      if (notFound) {
        this.dataStore.messageConversation.push(data);
      }

      this._messageConversation.next(Object.assign({}, this.dataStore).messageConversation);
    }, error => this.handleError(error));
  }

  //create the secific messageConversation-owrnershi-tye

  create(messageConversation: Message) {
    this.http.post(`${this.baseUrl}api/messageConversations/`, JSON.stringify(messageConversation), this.options)
      .map(response => response.json()).subscribe(data => {
        // response does not contain the imported data rather statuses;
        this.loadAll();
        // this.dataStore.messageConversation.push(data.data);
        // this._messageConversation.next(Object.assign({}, this.dataStore).messageConversation);
      }, error => this.handleError(error));
  }

  markAsRead(messageConversation: MessageConversation) {
    this.http.post(`${this.baseUrl}api/messageConversations/read`, JSON.stringify([messageConversation.id]), this.options)
      .map(response => response.json()).subscribe(data => {
        this.dataStore.messageConversation.forEach((t, i) => {
          if (data.markedRead.indexOf(t.id) > -1) { this.dataStore.messageConversation[i].read = true; }
        });

        this._messageConversation.next(Object.assign({}, this.dataStore).messageConversation);
      }, error => this.handleError(error));
  }


  deleteConversation(MessageConversationId: number) {
    this.http.delete(`${this.baseUrl}api/messageConversations?mc=${MessageConversationId}`).subscribe(response => {
      this.dataStore.messageConversation.forEach((t, i) => {
        if (t.id === MessageConversationId) { this.dataStore.messageConversation.splice(i, 1); }
      });

      this._messageConversation.next(Object.assign({}, this.dataStore).messageConversation);
    }, error => this.handleError(error));
  }

  private handleError(error: Response) {
    return Observable.throw(error || "Server Error");
  }

}
