import { Injectable, Inject } from '@angular/core';
import { MessageConversation } from '../models/message-conversation.model';
import { Message } from '../models/message.model';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs,  } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';

@Injectable()
export class MessageConversationService {
  messageConversation: Observable<MessageConversation[]>;
  pager: Observable<any>;
  options: any;
  plainTextOption: any;
  formDataOptions: any;
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
    let jsonHeaders = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let plainTextHeaders = new Headers({'Content-Type': 'text/plain'});
    let formDataHeaders = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    this.options = new RequestOptions({ headers: jsonHeaders }); // Create a request option
    this.plainTextOption = new RequestOptions({headers: plainTextHeaders});
    this.formDataOptions = new RequestOptions({headers: formDataHeaders});

  }

  //this loads all messageConversation

  loadAll(pageNumber?: Number | String, filters?:string) {

    let pageNo = pageNumber ? pageNumber : 1;
    let loadFilter = filters ? filters: '';
    this.http.get(`${this.baseUrl}api/messageConversations?fields=*&page=${pageNo}&pageSize=20&${loadFilter}`)
      .map(response => response.json()).subscribe(result => {
      this._pager.next(Object.assign({}, result).pager);
      this.dataStore.messageConversation = this.transformMessageConversation(result.messageConversations);
      this._messageConversation.next(Object.assign({}, this.dataStore).messageConversation);
    }, error => this.handleError(error));
  }


  load(id: number | string) {
    this.http.get(`${this.baseUrl}api/messageConversations/${id}.json?fields=*,userMessages[*,user[id,displayName]],messages[*]`).map(response => response.json()).subscribe(data => {
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

  //create the secific messageConversation-type

  create(messageConversation: Message) {
    this.http.post(`${this.baseUrl}api/messageConversations/`, JSON.stringify(messageConversation), this.options)
      .map(response => response.json()).subscribe(data => {
        // response does not contain the imported data rather statuses;
        this.loadAll();
        // this.dataStore.messageConversation.push(data.data);
        // this._messageConversation.next(Object.assign({}, this.dataStore).messageConversation);
      }, error => this.handleError(error));
  }


  replyConversation(conversationID: String, message: String) {
    this.http.post(`${this.baseUrl}api/messageConversations/${conversationID}`, message, this.plainTextOption)
      .map(response => response.json()).subscribe(data => {
        // response does not contain the imported data rather statuses;
        this.loadAll();
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

  markUnRead(messageConversation: MessageConversation) {
    this.http.post(`${this.baseUrl}api/messageConversations/unread`, JSON.stringify([messageConversation.id]), this.options)
      .map(response => response.json()).subscribe(data => {
        this.dataStore.messageConversation.forEach((t, i) => {
          if (data.markedUnread.indexOf(t.id) > -1) { this.dataStore.messageConversation[i].read = false; }
        });

        this._messageConversation.next(Object.assign({}, this.dataStore).messageConversation);
      }, error => this.handleError(error));
  }


  setPriority(messageConversationId: string, payload:any) {
    this.http.post(`${this.baseUrl}api/messageConversations/${messageConversationId}/priority?messageConversationPriority=${payload.priority}&messageType=TICKET`,this.options)
      .map(response => response.json()).subscribe(data => {
        this.dataStore.messageConversation.forEach((t, i) => {
          if (t.id == messageConversationId) {
            this.dataStore.messageConversation[i].priority = payload.priority;
          }
        });

        this._messageConversation.next(Object.assign({}, this.dataStore).messageConversation);
      }, error => this.handleError(error));
  }

  updateStatus(messageConversationId: string, payload:any) {
    this.http.post(`${this.baseUrl}api/messageConversations/${messageConversationId}/status?messageConversationStatus=${payload.status}`,this.options)
      .map(response => response.json()).subscribe(data => {
        this.dataStore.messageConversation.forEach((t, i) => {
          if (t.id == messageConversationId) {
            this.dataStore.messageConversation[i].status = payload.status;
          }
        });

        //this._messageConversation.next(Object.assign({}, this.dataStore).messageConversation);
      }, error => this.handleError(error));
  }

  assignToMember(messageConversationId: string, memberId:string) {
    let body = 'userId=' + memberId;
    this.http.post(`${this.baseUrl}api/messageConversations/${messageConversationId}/assign`,body,this.formDataOptions)
      .map(response => response.json()).subscribe(data => {
        this.dataStore.messageConversation.forEach((t, i) => {
          if (t.id == messageConversationId) {
            this.dataStore.messageConversation[i].assignee = {id: memberId};
          }
        });
      }, error => this.handleError(error));
  }

  deleteAssignment(messageConversationId: string) {
    this.http.delete(`${this.baseUrl}api/messageConversations/${messageConversationId}/assign`)
      .map(response => response.json()).subscribe(data => {
        this.dataStore.messageConversation.forEach((t, i) => {
          if (t.id == messageConversationId) {
            this.dataStore.messageConversation[i].assignee = null;
          }
        });
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


  sendFeedBackMessage(payload: any) {
    return this.http.post(`${this.baseUrl}api/messageConversations?messageType=TICKET&messageConversationStatus=OPEN`, payload, this.options)
        .map((response: Response) => {
          this.loadAll();
          return response;
        })
        .catch( this.handleError );
  }

  loadSingleMessage(id:string) {
    return this.http.get(`${this.baseUrl}api/messageConversations/${id}?fields=*,userMessages[*,user[id,displayName]],messages[*]`)
        .map((response: Response) => response.json())
        .catch( this.handleError );
  }


  private handleError(error: Response) {
    return Observable.throw(error || "Server Error");
  }

  transformMessageConversation(messageConvo: any){
    let convo = [];
    convo = _.transform(messageConvo,(results,message) => {
      let messageCount = message.messageCount > 1 ? `(${message.messageCount})`: '';
      if(message.lastSenderFirstname && (message.userFirstname !== message.lastSenderFirstname)){
        message.participants = `${message.lastSenderFirstname} ${message.lastSenderSurname},${message.userFirstname} ${message.userSurname} ${messageCount}`;
        message.avatarName = `${message.userFirstname} ${message.userSurname}`;
      }else if(message.userFirstname && message.userSurname && message.messageType !== 'SYSTEM'){
        message.participants = `${message.userFirstname} ${message.userSurname} ${messageCount}`;
        message.avatarName = `${message.userFirstname} ${message.userSurname}`;
      }else {
        message.participants = `System Notification ${messageCount}`;
        message.avatarName = `System Notification`;
      }
      results.push(message);
    },[])

    return messageConvo;
  }

}
