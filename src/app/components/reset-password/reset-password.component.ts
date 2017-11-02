import { Component, OnInit, Input, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SharedDataService } from '../../shared/shared-data.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { DataStoreService } from '../../services/data-store.service';
import { matchOtherValidator } from '../../shared/match-other-validator';
import { passwordValueValidator } from '../../shared/password-value-validator';
import { MessageConversationService } from '../../services/message-conversation.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

import * as _ from 'lodash';
import * as async from 'async-es';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  @Input() selectedUser: any;
  @Output() resetSelectedUser: EventEmitter<any> = new EventEmitter<any>();
  @Output() onResetPasswordClosed: EventEmitter<any> = new EventEmitter<any>();
  public allUsers: any;
  public optionsModel: number[];
  public isLoadingUser: boolean = false;
  public selectedItem: any;
  public passwordForm: FormGroup;
  private feedbackRecipients: any;
  public showSearchInput: boolean = true;
  public resetPasswordHeader: string = 'Please Select User to Reset password';
  public positionAbsolute: boolean = false;
  public firstClick: boolean;
  public isCurrentlySendingData: boolean = false;
  public isSendingMessage: boolean = false;

  constructor(private _userService: UserService,
    private _dataStoreService: DataStoreService,
    private _toastService: ToastService,
    private _messageConversationService: MessageConversationService,
    private _sharedDataService: SharedDataService) {

  }

  ngOnInit() {
    this.firstClick = true;

    this._userService.getAllUsers().subscribe(response => {
      this.allUsers = _.transform(response.users, (results, user) => {
        results.push({
          id: user.id,
          name: user.displayName
        })
      }, []);
    })

    this.passwordForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(8), passwordValueValidator]),
      confirm: new FormControl('', [Validators.required, Validators.minLength(8), matchOtherValidator('password')])
    });

    this._sharedDataService.getFeedbackReceipients().subscribe(response => {
      this.feedbackRecipients = response;
    })

    if (this.selectedUser) {
      this.onUserSelect(this.selectedUser);
    }

  }


  onUserSelect(event) {
    this.isLoadingUser = true;
    this.selectedItem = Object.assign({},event);
    this._userService.getUser(event.id, '?fields=id,displayName,email,firstName,surname,phoneNumber,userCredentials,userGroups,organisationUnits').subscribe(response => {
      this.isLoadingUser = false;
      this.selectedUser = response;
    })
  }


  /**
   * [createDataStoreObjKey generate random 62-bits key]
   * @return {[string]} [generated random key]
   */
  createDataStoreObjKey() {
    let formatter = new Intl.DateTimeFormat("fr", { month: "short" }),
      month = formatter.format(new Date()),
      text = '',
      possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 3; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return month.slice(0, -1).toUpperCase().concat('_', text);

  }



  onSubmit({ value, valid }: { value: any, valid: boolean }) {

    this.selectedUser.userCredentials.password = value.password;

    let dataStoreKey = this.createDataStoreObjKey();
    let datasetUrlTosendTo = `api/users/${this.selectedUser.id}`;
    let payload = [{
      url: datasetUrlTosendTo,
      method: 'PUT',
      status: 'OPEN',
      action: `Reset ${this.selectedUser.displayName} password.`,
      payload: this.selectedUser
    }];

    let feedbackSubject = `${dataStoreKey}:REQUEST TO RESET PASSWORD`;
    let text = `There is request to reset password to ${this.selectedUser.displayName}`;
    this.isCurrentlySendingData = true;
    this._dataStoreService
      .createNewKeyAndValue(dataStoreKey, payload)
      .subscribe(response => {

        if (response.ok) {
          this.isCurrentlySendingData = false;
          this._toastService.success('Your changes were sent for approval, Thanks.')
          this.sendFeedBackMessage(feedbackSubject, text);

        } else {
          this._toastService.error('There was an error when sending data.')
          this.isCurrentlySendingData = false;
        }
      });


  }


  /**
   * [sendFeedBackMessage description]
   * @param  {string} subject [description]
   * @param  {string} message [description]
   * @return {[type]}         [description]
   */
  sendFeedBackMessage(subject: string, message: string) {
    let payload = {
      subject: subject,
      text: message,
      userGroups: [{ id: this.feedbackRecipients.id }]
    }
    this.isSendingMessage = true;
    this._messageConversationService.sendFeedBackMessage(payload).subscribe(response => {
      // TODO: Send notification if possible about new message.
      //console.log(response);
      this.isSendingMessage = false;
      this.onResetPasswordClosed.emit({
        closed: true
      });

    })
  }


  userSelected(event) {
    this.onUserSelect(event.selectedItem);
  }

  ngOnDestroy() {
    this.resetSelectedUser.emit({
      reset: true
    })
  }


  // TODO: (barnabas) find better way to prevent close on clicking add form buttons.
  clickOutside(event) {
    if ( !this.firstClick && event) {
      this.onResetPasswordClosed.emit({
        closed: true
      });
    }
    this.firstClick = false;
  }

}
