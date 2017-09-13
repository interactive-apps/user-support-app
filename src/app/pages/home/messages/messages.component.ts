import { Component, OnInit } from '@angular/core';
import { MessageConversationService } from '../../../services/message-conversation.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { MessageConversation } from '../../../models/message-conversation.model';
import { DialogService } from 'ng2-bootstrap-modal';
import { ComposeMessageComponent } from './compose-message/compose-message.component';
import { FormControl, FormGroup, Validators} from '@angular/forms';


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
  public messageConversation: Observable<MessageConversation[]>;
  public messageReplyFormGroup: FormGroup;


  constructor(private _messageConversationService: MessageConversationService, private _dialogService: DialogService) {

    this.getAllUserMessageConversations();

  }

  ngOnInit() {

    this.messageReplyFormGroup = new FormGroup({
      message: new FormControl('')
    });

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
    this._messageConversationService.deleteConversation(message.id);
  }


  closeMessage() {
    this.openedMessage = null;
  }

  getAllUserMessageConversations(pageNumber?:Number) {
    this._messageConversationService.loadAll(pageNumber);
    this.messageConversation = this._messageConversationService.messageConversation;
    this._messageConversationService.pager.subscribe(val => {
      this.pager = val;
      this.isDataLoaded = true;
    });
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


   onReplyMessage(conversationID:String ,{ value, valid }: { value: any, valid: boolean }) {
     this._messageConversationService.replyConversation(conversationID,value.message);
     this.messageReplyFormGroup.reset();
     this.closeMessage();
   }

}
