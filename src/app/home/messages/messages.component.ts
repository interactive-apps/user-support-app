import { Component, OnInit } from '@angular/core';
import { MessageConversationService } from '../../services/message-conversation.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { MessageConversation } from '../../models/message-conversation.model'

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  public isActive = 'all';
  public messages:any = [];
  messageConversation: Observable<MessageConversation[]>;


  constructor(private _messageConversationService: MessageConversationService) {

    this.getAllUserMessageConversations();

  }

  ngOnInit() {

  }

  messagesFilters(filter){
    this.isActive = filter;
    console.log(filter);
  }

  getAllUserMessageConversations(){
    this._messageConversationService.loadAll();
    this.messageConversation = this._messageConversationService.messageConversation;
  }

}
