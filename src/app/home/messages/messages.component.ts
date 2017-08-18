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
  public messages: any = [];
  public openedMessage: string = null;
  messageConversation: Observable<MessageConversation[]>;


  constructor(private _messageConversationService: MessageConversationService) {

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

  getAllUserMessageConversations() {
    this._messageConversationService.loadAll();
    this.messageConversation = this._messageConversationService.messageConversation;

    this.messageConversation.subscribe(val => {
      console.log(val);
    })
  }

}
