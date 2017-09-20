import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { EmailMessage } from '../../../../models/email-message.model';
import { Message } from '../../../../models/message.model';
import { UserService } from '../../../../services/user.service';
import { SharedDataService } from '../../../../shared/shared-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { MessageConversationService } from '../../../../services/message-conversation.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-compose-feedback',
  templateUrl: './compose-feedback.component.html',
  styleUrls: ['./compose-feedback.component.css']
})
export class ComposeFeedbackComponent extends DialogComponent<EmailMessage, boolean> implements EmailMessage {
  subject: string;
  text: string;
  feedbackComposeForm: FormGroup;
  feedbackRecipients: any;

  constructor(private fb: FormBuilder, dialogService: DialogService,
              private _userService: UserService,
              private _messageConversationService: MessageConversationService,
              private _sharedDataService: SharedDataService) {
    super(dialogService)
  }

  ngOnInit() {
    this.feedbackComposeForm = this.fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });

    this.feedbackComposeForm.patchValue({
      subject: this.subject,
      text: this.text,
    });

    this._sharedDataService.getFeedbackReceipients().subscribe(response =>{

      this.feedbackRecipients = response;

    })
  }

  /**
   * [onSendFeedback description]
   * @param  {[type]}     {value [description]
   * @param  {Message}    valid} [description]
   * @param  {boolean }}    valid         [description]
   * @return {[type]}            [description]
   */
  onSendFeedback({ value, valid }: { value: Message, valid: boolean }) {
    let payload = {
      subject: value.subject,
      text: value.message,
      userGroups: [{id: this.feedbackRecipients.id}]
    }
    this._messageConversationService.sendFeedBackMessage(payload).subscribe(response =>{
      // TODO: Send notification if possible about new message.
      //console.log(response);

    })
    this.close();
  }

}
