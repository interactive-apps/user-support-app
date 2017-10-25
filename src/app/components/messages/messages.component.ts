import { Injectable, Inject, Component, OnInit } from '@angular/core';
import { MessageConversationService } from '../../services/message-conversation.service';
import { DataStoreService } from '../../services/data-store.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { SharedDataService } from '../../shared/shared-data.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { MessageConversation } from '../../models/message-conversation.model';
import { DialogService } from 'ng2-bootstrap-modal';
import { ComposeMessageComponent } from './compose-message/compose-message.component';
import { ComposeFeedbackComponent } from './compose-feedback/compose-feedback.component';
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
  public textAreaMessageFocused: boolean = false;
  public currentPage: Number;
  public pager: any = {};
  public dataStoreValues: any = [];
  public feedbackRecipients: any = [];
  public assignedMember: string;
  public openedConversation: any;
  public messageConversation: Observable<MessageConversation[]>;
  public messageReplyFormGroup: FormGroup;
  public dataStoreKey: string;
  public disableApproveAll: boolean = false;
  public isCurrentUserInFeedbackGroup: boolean = false;
  public statuses = [
    {id:'OPEN', name: 'OPEN'},
    {id:'PENDING', name: 'PENDING'},
    {id:'INVALID', name: 'INVALID'},
    {id:'SOLVED', name:'SOLVED'}
  ];
  public priorities = [
    {id:'LOW', name: 'LOW'},
    {id: 'MEDIUM', name: 'MEDIUM'},
    {id:'HIGH', name: 'HIGH'}
  ];

  public tabFilter = [
    {id:'all', name: 'All Messages'},
    {id:'followUp', name: 'Follow up'},
    {id: 'assignedToMe', name: 'Assigned'}
  ];
  public currentUser: any;
  public selectedFilterByStatus:string = 'all';
  public selectedFilterByPriority:string = 'Show all';
  public priorityHeader = 'Priorities';
  public statusHeader = 'Status';
  public assignToMemberHeader= 'Assign to:';

  public availableStatus:any = [
    {id: 'ALL', name: 'Show all'},
    {id: 'NONE', name: 'No status'},
    {id: 'PENDING', name: 'Pending'},
    {id: 'OPEN', name: 'Open'},
    {id: 'INVALID', name: 'Invalid'},
    {id: 'SOLVED', name: 'Solved'}
  ];

  public availablePriorities:any = [
    {id: 'ALL', name: 'Show all'},
    {id: 'LOW', name: 'LOW'},
    {id: 'MEDIUM', name: 'MEDIUM'},
    {id: 'HIGH', name: 'HIGH'}
  ];

  private requestsAreResolved: boolean = false;



  constructor(private _messageConversationService: MessageConversationService,
              private _dialogService: DialogService,
              private _dataStoreService: DataStoreService,
              private _sharedDataService: SharedDataService,
              private _userService: UserService,
              @Inject('rootDir') _rootDir: string,
              private _toastService: ToastService) {
  }

  ngOnInit() {

    this.messageReplyFormGroup = new FormGroup({
      message: new FormControl('',Validators.required),
    });

    /**
     * [parallel async send multiple requests in parallel the outer bound is the one wh]
     * @param  {[type]} [(callback [description]
     * @return {[type]}            [description]
     */
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
      this.feedbackRecipients = _.transform(results[0].users,(result, user) =>{
        result.push({id: user.id, name: user.displayName});
      },[]);
      // Add none which will be use to delete assingment
      this.feedbackRecipients.push({id:'none', name: 'None'});
      this.isCurrentUserInFeedbackGroup = _.findIndex(results[1].userGroups, { id: results[0].id }) !== -1;

    })



  }


  /**
   * [setMessagePriority changes priority of the message]
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  setMessagePriority(event:any){
    console.log(event);
    let payload = {
      priority: event.selectedItem.id
    }
    this._messageConversationService.setPriority(this.openedMessage, payload);
  }

  /**
   * [setMessageStatus change status of the message]
   * @param  {any}    event [description]
   * @return {[type]}       [description]
   */
  setMessageStatus(event: any){
    console.log(event);
    let payload = {
      status: event.selectedItem.id
    }
    this._messageConversationService.updateStatus(this.openedMessage, payload);
  }

  /**
   * [assignToMessage Assignes the message to user]
   * @param  {any}    event [description]
   * @return {[type]}       [description]
   */
  assignToMessage(event: any){
      if(event.selectedItem.id == 'none'){
        this._messageConversationService.deleteAssignment(this.openedMessage);
      }else{
        this._messageConversationService.assignToMember(this.openedMessage, event.selectedItem.id);
      }
  }

  /**
   * [messagesFilters apply filters during message load]
   * @param  {string} filter [filter]
   */
  messagesFilters(filter:string) {
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

  updateSelectedFilterStatus(event:any){
    this.filter = ''
    this.selectedFilterByStatus = event;
    if (event.selectedItem.id !== 'ALL'){
      this.filter =  `filter=status:eq:${event.selectedItem.id}`;
    }
    this.getAllUserMessageConversations()
  }

  updateSelectedFilterPriority(event: any){
    this.filter = '';
    if (event.selectedItem.id !== 'ALL'){
      this.filter =  `filter=priority:eq:${event.selectedItem.id}`;
    }
    this.getAllUserMessageConversations()
  }


  /**
   * [openMessage Open message to read]
   * @param  {[Object]} message [Message conversation which is opened]
   */
  openMessage(message:any) {
    this._messageConversationService.loadSingleMessage(message.id).subscribe(response =>{
      this.openedMessage = message.id;
      this.openedConversation = response;

      let userSentTo = _.map(response.userMessages, (userMessage)=>{
        return userMessage.user;
      });

      this.openedConversation.messages = _.transform(response.messages, (results, message)=>{
        if(!message.sender){
          message.senderDisplayName = 'System Notification';
          message.userSentTo = userSentTo;
        } else {
          let [sender,sentTo] = _.partition(userSentTo,message.sender);
          message.senderDisplayName = sender[0].displayName;
          message.userSentTo = sentTo;
        }
        results.push(message);
      },[]);

    })
    this.checkIfIsUserSupportMessage(message);
    this.markAsRead(message);
  }

  /**
   * [markAsRead mark specific message as read]
   * @param  {any}    message [messageconversation that is to be marked read]
   */
  markAsRead(message:any) {
      message.read = true;
      this._messageConversationService.markAsRead(message);
  }

  /**
   * [markUnRead mark specific message as unread]
   * @param  {any}    message [description]
   * @return {[type]}         [description]
   */
  markUnRead(message:any) {
    message.read = false;
    this._messageConversationService.markUnRead(message);
  }

  /**
   * [deleteMessage delete specific message conversation]
   * @param  {[type]} message [Message conversation to be deleted]
   */
  deleteMessage(message) {
    this._messageConversationService.deleteConversation(message.id);
  }

  /**
   * [closeMessage Close the opened message]
   */
  closeMessage() {
    this.openedMessage = null;
  }

  /**
   * [getAllUserMessageConversations get all user messages]
   * @param  {Number} pageNumber [pageNumber]
   */
  getAllUserMessageConversations(pageNumber?: Number) {
    this._messageConversationService.loadAll(pageNumber, this.filter);
    this.messageConversation = this._messageConversationService.messageConversation;
    this._messageConversationService.pager.subscribe(val => {
      this.pager = val;
      this.isDataLoaded = true;
    });
  }

  /**
   * [showComposeMessage open ComposeMessageComponent modal]
   * @param  {string} subject [subject]
   * @param  {string} text    [message content]
   */
  showComposeMessage(subject?: string, text?: string) {
    let disposable = this._dialogService.addDialog(ComposeMessageComponent, {
      subject: subject,
      text: text
    })
      .subscribe((isConfirmed) => {

      });
  }

  /**
   * [showComposeFeedback Opens the ComposeFeedbackComponent modal]
   * @param  {string} subject [subject]
   * @param  {string} text    [message content]
   */
  showComposeFeedback(subject?: string, text?: string) {
    let disposable = this._dialogService.addDialog(ComposeFeedbackComponent, {
      subject: subject,
      text: text
    })
      .subscribe((isConfirmed) => {

      });
  }

  /**
   * [getPage get page number and its messages]
   * @param  {number} page [page number]
   */
  getPage(page:number) {
    this.currentPage = page;
    this.isDataLoaded = false;
    this.isLoadingMessagesPagination = true;
    this.getAllUserMessageConversations(page);
  }

  /**
   * [onReplyMessage description]
   * @param  {String}     conversationID [description]
   * @param  {[Object]}     {value         [contains the content of the form]
   * @param  {any}        valid}         [description]
   * @param  {boolean }}            valid         [description]
   */
  onReplyMessage(conversationID: String, { value, valid }: { value: any, valid: boolean }) {
    this._messageConversationService.replyConversation(conversationID, value.message);
    this.messageReplyFormGroup.reset();
    this.setFocusReplyMessage();
    this.closeMessage();
  }

  /**
   * [checkIfIsUserSupportMessage: this checks if the message is from user support application]
   * @param  {[object]} message [single object to check if is from user support application]
   * @return {[void]}         [none]
   */
  checkIfIsUserSupportMessage(message) {
    this.assignedMember = null;
    if(message.assignee){
     let assignee = _.filter(this.feedbackRecipients, message.assignee);
     this.assignedMember = assignee[0].name;
    }

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

  /**
   * [loadAndFormatDataStoreValue description]
   * @param  {string} dataStoreKey [description]
   * @return {[type]}              [description]
   */

  loadAndFormatDataStoreValue(dataStoreKey: string) {
    this._dataStoreService.getValuesOfDataStoreNamespaceKeys(dataStoreKey)
      .subscribe(response => {
        this.loadingDataStoreValue = false;
        this.dataStoreValues = response;
        this.disableApproveAll = (_.findIndex(response, { status: 'SOLVED' }) !== -1);
      });
  }

  /**
   * [approveChangesDataset changes status of the datastore value and update disableApproveAll]
   * @param  {any}    dataSet [dataStoreValues]
   */
  approveChangesDataset(dataSet: any, approved:boolean) {
    let asyncRequestsArray = [];
    let updatedDatastoreValues = [];


    if (_.isArray(dataSet)) {
      asyncRequestsArray = _.transform(dataSet, (result, obj) => {
        obj.status = 'SOLVED';

        approved ? (obj.approved = true) : (obj.rejected = true);

        result.push(obj);
      }, []);
      updatedDatastoreValues = asyncRequestsArray;
      this.disableApproveAll = true;
      this.requestsAreResolved = true;

    } else {
      let index = _.findIndex(this.dataStoreValues, { url: dataSet.url });
      dataSet.status = 'SOLVED';

      approved ? (dataSet.approved = true) : (dataSet.rejected = true);

      this.dataStoreValues.splice(index, 1, dataSet);
      this.disableApproveAll = (_.findIndex(this.dataStoreValues, { status: 'SOLVED' }) !== -1);
      this.requestsAreResolved = (_.findIndex(this.dataStoreValues, { status: 'OPEN' }) == -1);
      updatedDatastoreValues = this.dataStoreValues;
      asyncRequestsArray.push(dataSet);
    }

    /**
     * [map map all object]
     * @param  {[object]} asyncRequestsArray   [dataset array to be posted]
     * @param  {[function]} this.requestCallBack [callback function]
     * @param  {[function]} this.asyncDone       [callback function]
     */
    async.map(asyncRequestsArray, this.requestCallBack, this.asyncDone);

    this._dataStoreService.updateValuesDataStore(this.dataStoreKey, updatedDatastoreValues)
      .subscribe(response => {

        if(response.ok){
          this._toastService.success('Datastore status was updated successfully.');

        } else {
          this._toastService.error('There was an error when updating Datastore Status.');

        }
      });

  }

  /**
   * [callback: This function will be executed for every object in array async and parallel]
   * @param  {[object]} obj          [object in a collection]
   * @param  {[function]} doneCallBack [A call back function]
   * @return {[function]}              [callback function with error and response results]
   */
  callback(obj, doneCallBack) {

    if (obj.rejected) {
      return doneCallBack(null, obj);
    } else {

      if (obj.method.toLowerCase() === 'put' && obj.approved) {

        this._sharedDataService.genericPutRequest(obj.url, obj.payload).subscribe(response => {
          return doneCallBack(null, response);
        });
      } else if(obj.method.toLowerCase() === 'post' && obj.approved) {
        this._sharedDataService.genericPostRequest(obj.url, obj.payload).subscribe(response => {
          return doneCallBack(null, response);
        });
      }

    }
  }

  /**
   * [this is to bind this in the callback]
   * @param  {[object]} this [global object that holds the value of this function]
   * @return {[function]}      [callback function with global this variable]
   */
  requestCallBack = this.callback.bind(this);

  /**
   * [asyncDone: This is the final done callback after async execution of all request]
   * @param  {[object]} error   [Array collection of all errors]
   * @param  {[object]} results [Array collection of all response results]
   * @return {[void]}         [none]
   */
  private asyncDoneAsnc(error, results) {
    console.log(results);
    if(results.length){
      this._toastService.success('Approved changes were updated successfully.');

    } else {
      this._toastService.error('There was an error when sending approved changes.');

    }

    if(this.requestsAreResolved){
      let message = `Your request has been resolved. \n Thanks`;
      this._messageConversationService.replyConversation(this.openedConversation.id, message);
      this.closeMessage();
    }
  }

  /**
   * [bind bind callback function with global this]
   * @param  {[function]} this [this]
   */
  asyncDone = this.asyncDoneAsnc.bind(this);


  /**
   * [formatDate: format date to well understandable way]
   * @param  {[date]} date [creted date in ISO]
   * @return {[date]}      [formated date to human readable]
   */
  formatDate(date) {
    return moment(date).format('ll')
  }


  setFocusReplyMessage(){
    this.textAreaMessageFocused = !this.textAreaMessageFocused;
  }



}
