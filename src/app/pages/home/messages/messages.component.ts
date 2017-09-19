import { Injectable, Inject, Component, OnInit } from '@angular/core';
import { MessageConversationService } from '../../../services/message-conversation.service';
import { DataStoreService } from '../../../services/data-store.service';
import { UserService } from '../../../services/user.service';
import { SharedDataService } from '../../../shared/shared-data.service';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { MessageConversation } from '../../../models/message-conversation.model';
import { DialogService } from 'ng2-bootstrap-modal';
import { ComposeMessageComponent } from './compose-message/compose-message.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import async from 'async-es';
import * as moment from 'moment';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  public isActive = 'all';
  public filter: string = '';
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
  public dataStoreKey: string;
  public disableApproveAll: boolean = false;
  public isCurrentUserInFeedbackGroup: boolean = false;
  public statuses = ['OPEN', 'PENDING', 'INVALID', 'SOLVED'];
  public priorities = ['LOW', 'MEDIUM', 'HIGH'];

  private baseUrl: string;
  private options: any;
  private currentUser: any;


  constructor(private _messageConversationService: MessageConversationService,
    private _dialogService: DialogService,
    private _dataStoreService: DataStoreService,
    private _sharedDataService: SharedDataService,
    private _userService: UserService,
    @Inject('rootDir') _rootDir: string,
    private http: Http) {

    let jsonHeaders = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    this.options = new RequestOptions({ headers: jsonHeaders }); // Create a request option
    this.baseUrl = _rootDir;

  }

  ngOnInit() {

    this.messageReplyFormGroup = new FormGroup({
      message: new FormControl(''),
      status: new FormControl(''),
      priority: new FormControl('')
    });

    this.messageReplyFormGroup.controls['status'].valueChanges.subscribe(valueChange => {
      let payload = {
        status: valueChange
      }
      this._messageConversationService.updateStatus(this.openedMessage, payload);

    });

    this.messageReplyFormGroup.controls['priority'].valueChanges.subscribe(valueChange => {
      let payload = {
        priority: valueChange
      }
      this._messageConversationService.setPriority(this.openedMessage, payload);

    });

    async.parallel([
      (callback) => {
        this._sharedDataService.getFeedbackReceipients().subscribe(response => {
          callback(null, response)
        })
      },
      (callback) => {
        this._userService.getUserInformation().subscribe(response => {
          callback(null, response);
        })
      },
      (callback) => {
        this.getAllUserMessageConversations();

        callback(null, null);
      }
    ], (error, results) => {
      this.currentUser = results[1];
      this.isCurrentUserInFeedbackGroup = _.findIndex(results[1].userGroups, { id: results[0].id }) !== -1;

    })



  }

  messagesFilters(filter) {
    switch (filter) {
      case 'followUp':
        if (this.isActive !== filter) {
          this.isActive = filter;
          this.filter = 'filter=followUp:in:[true]';
          this.getAllUserMessageConversations();
        }
        break;
      case 'assignedToMe':

        if (this.isActive !== filter) {
          this.isActive = filter;
          this.filter = `filter=assignee.id:eq:${this.currentUser.id}`;
          this.getAllUserMessageConversations();
        }
        break;
      default:

        if (this.isActive !== filter) {
          this.isActive = filter;
          this.filter = '';
          this.getAllUserMessageConversations();
        }
        break;
    }
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
    this._messageConversationService.loadAll(pageNumber, this.filter);
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
      month_reg = formatter.format(new Date()).slice(0, -1),
      regex1 = new RegExp('^' + month_reg, 'i'),
      regex2 = message.subject.includes(':'),
      dataStoreKey = message.subject.split(':')[0];

    if (regex1.test(dataStoreKey) && regex2 && dataStoreKey.includes('_')) {
      this.dataStoreKey = dataStoreKey;
      this.loadAndFormatDataStoreValue(dataStoreKey);
      this.isUserSupportMsg = true;
    } else {
      this.isUserSupportMsg = false;
    }

  }

  loadAndFormatDataStoreValue(dataStoreKey: string) {
    this._dataStoreService.getValuesOfDataStoreNamespaceKeys(dataStoreKey)
      .subscribe(response => {
        this.loadingDataStoreValue = false;
        this.dataStoreValues = response;
        this.disableApproveAll = (_.findIndex(response, { status: 'SOLVED' }) !== -1);
      });
  }

  approveChangesDataset(dataSet: any) {
    let asyncRequestsArray = [];
    let updatedDatastoreValues = [];

    if (_.isArray(dataSet)) {
      asyncRequestsArray = _.transform(dataSet, (result, obj) => {
        obj.status = 'SOLVED';
        result.push(obj);
      }, []);
      updatedDatastoreValues = asyncRequestsArray;
      this.disableApproveAll = true;

    } else {
      let index = _.findIndex(this.dataStoreValues, { url: dataSet.url });
      dataSet.status = 'SOLVED';
      this.dataStoreValues.splice(index, 1, dataSet);

      updatedDatastoreValues = this.dataStoreValues;
      asyncRequestsArray.push(dataSet);
    }

    async.map(asyncRequestsArray, this.requestCallBack, this.asyncDone);

    this._dataStoreService.updateValuesDataStore(this.dataStoreKey, updatedDatastoreValues)
      .subscribe(response => {
        console.log(response);
      });

  }

  callback(obj, doneCallBack) {
    this._dataStoreService.updateValuesDataStore(obj.payload.id, obj.payload).subscribe(response => {
      return doneCallBack(null, response);
    })
  }

  requestCallBack = this.callback.bind(this);

  private asyncDone(error, results) {
    console.log(results);
  }


  formatDate(date) {
    return moment(date).format('ll')
  }

}
