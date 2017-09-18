import { Injectable, Inject, Component, OnInit } from '@angular/core';
import { MessageConversationService } from '../../../services/message-conversation.service';
import { DataStoreService } from '../../../services/data-store.service';
import { SharedDataService } from '../../../shared/shared-data.service';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { MessageConversation } from '../../../models/message-conversation.model';
import { DialogService } from 'ng2-bootstrap-modal';
import { ComposeMessageComponent } from './compose-message/compose-message.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  public isActive = 'all';
  public isDataLoaded = false;
  public isLoadingMessagesPagination = false;
  public isUserSupportMsg = false;
  public loadingDataStoreValue = true;
  public messages: any = [];
  public openedMessage: string = null;
  public currentPage: Number;
  public pager: any = {};
  public dataStoreValues: any = [];
  public messageConversation: Observable<MessageConversation[]>;
  public messageReplyFormGroup: FormGroup;
  private baseUrl: String;
  private options: any;


  constructor(private _messageConversationService: MessageConversationService,
              private _dialogService: DialogService,
              private _dataStoreService: DataStoreService,
              private _sharedDataService: SharedDataService,
              @Inject('rootDir') _rootDir: string,
              private http: Http) {

    let jsonHeaders = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    this.options = new RequestOptions({ headers: jsonHeaders }); // Create a request option
    this.baseUrl = _rootDir;

  }

  ngOnInit() {
    this.getAllUserMessageConversations();

    this.messageReplyFormGroup = new FormGroup({
      message: new FormControl('')
    });

  }

  messagesFilters(filter) {
    this.isActive = filter;
  }

  openMessage(message) {
    this.openedMessage = message.id;
    this.checkIfIsUserSupportMessage(message);
    this.markAsRead(message);
  }

  markAsRead(message) {
    if (!message.read) {
      message.read = true;
      this._messageConversationService.markAsRead(message);
    }
  }

  deleteMessage(message) {
    this._messageConversationService.deleteConversation(message.id);
  }


  closeMessage() {
    this.openedMessage = null;
  }

  getAllUserMessageConversations(pageNumber?: Number) {
    this._messageConversationService.loadAll(pageNumber);
    this.messageConversation = this._messageConversationService.messageConversation;
    this._messageConversationService.pager.subscribe(val => {
      this.pager = val;
      this.isDataLoaded = true;
    });
  }

  showComposeMessage(subject?: string, text?: string) {
    let disposable = this._dialogService.addDialog(ComposeMessageComponent, {
      subject: subject,
      text: text
    })
      .subscribe((isConfirmed) => {

      });
  }

  getPage(page) {
    this.currentPage = page;
    this.isDataLoaded = false;
    this.isLoadingMessagesPagination = true;
    this.getAllUserMessageConversations(page);
  }


  onReplyMessage(conversationID: String, { value, valid }: { value: any, valid: boolean }) {
    this._messageConversationService.replyConversation(conversationID, value.message);
    this.messageReplyFormGroup.reset();
    this.closeMessage();
  }


  checkIfIsUserSupportMessage(message) {
    let formatter = new Intl.DateTimeFormat("fr", { month: "short" }),
        month_reg = formatter.format(new Date()).slice(0,-1),
        regex1 = new RegExp('^'+month_reg,'i'),
        regex2 = message.subject.includes(':'),
        dataStoreKey = message.subject.split(':')[0];

    if(regex1.test(dataStoreKey) && regex2 && dataStoreKey.includes('_')){
      this.loadAndFormatDataStoreValue(dataStoreKey);
      this.isUserSupportMsg = true;
    } else {
       this.isUserSupportMsg = false;
    }

  }

  loadAndFormatDataStoreValue(dataStoreKey:string){
    this._dataStoreService.getValuesOfDataStoreNamespaceKeys(dataStoreKey)
        .subscribe(response =>{
          this.loadingDataStoreValue = false;
          this.dataStoreValues = response;
        })
  }

  approveChangesDataset(dataSet: any){
    let asyncRequestsArray = [];

    if (_.isArray(dataSet)) {
      asyncRequestsArray = _.transform(dataSet,(result, obj)=>{
        let url = `${this.baseUrl}${obj.url}`;
        let requestObj = this.returnObservable(url, obj);
        result.push(requestObj);
      },[])
    } else {
      
      let url = `${this.baseUrl}${dataSet.url}`;
      let requestObj = this.returnObservable(url,dataSet)
      asyncRequestsArray.push(requestObj);
    }

    this._sharedDataService.sendMultipleAsyncRequests(asyncRequestsArray).subscribe((response)=>{
      console.log(response);
      //TODO: make the message solved and update the datastore value as served.
    });

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
