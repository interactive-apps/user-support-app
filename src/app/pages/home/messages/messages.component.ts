import { Component, OnInit } from '@angular/core';
import { MessageConversationService } from '../../../services/message-conversation.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { MessageConversation } from '../../../models/message-conversation.model';
import { DialogService } from 'ng2-bootstrap-modal';
import { ComposeMessageComponent } from './compose-message/compose-message.component';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  public isActive = 'all';
  public isDataLoaded = false;
  public isLoadingMessagesPagination = false;
  public messages: any = [];
  public openedMessage: string = null;
  public currentPage: Number;
  public pager: any = {};
  messageConversation: Observable<MessageConversation[]>;


  constructor(private _messageConversationService: MessageConversationService, private _dialogService: DialogService) {

    this.getAllUserMessageConversations();

  }

  ngOnInit() {

  }

  messagesFilters(filter) {
    this.isActive = filter;
    console.log(filter);
  }

  openMessage(message) {
    this.openedMessage = message.id;
    this.markAsRead(message);
  }

  markAsRead(message) {
    if (!message.read) {
      message.read = true;
      this._messageConversationService.markAsRead(message);
    }
  }

  deleteMessage(message) {
    console.log(message);
    this._messageConversationService.deleteConversation(message.id);
  }
  closeMessage() {
    this.openedMessage = null;
  }

  getAllUserMessageConversations(pageNumber?:Number) {
    this._messageConversationService.loadAll(pageNumber);
    this.messageConversation = this._messageConversationService.messageConversation;
    //this.pager = this._messageConversationService.pager;
    this._messageConversationService.pager.subscribe(val => {
      this.pager = val;
      this.isDataLoaded = true;
    });
    // this.messageConversation.subscribe(val => {
    //   console.log(val);
    // })
  }

  showComposeMessage(subject?:string, text?:string) {
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

}
