import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SharedDataService } from '../../shared/shared-data.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { DataStoreService } from '../../services/data-store.service';
import { matchOtherValidator } from '../../shared/match-other-validator';
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

  public allUsers: any;
  public optionsModel: number[];
  public selectedUser: any;
  public userLoaded: boolean = false;
  public passwordForm: FormGroup;
  private feedbackRecipients: any;

  // Settings configuration
  public mySettings: IMultiSelectSettings = {
    enableSearch: true,
    buttonClasses: 'btn btn-secondary btn-sm btn-block',
    containerClasses: 'dropdown-block',
    selectionLimit: 1,
    autoUnselect: true,
    closeOnSelect: true,
    displayAllSelectedText: true
  };

  // Text configuration
  public myTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'user selected',
    checkedPlural: 'users selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'Select user to reset password',
    allSelected: 'All selected',
  };

  constructor(private _userService: UserService,
              private _dataStoreService: DataStoreService,
              private _toastService: ToastService,
              private _messageConversationService: MessageConversationService,
              private _sharedDataService: SharedDataService) {

  }

  ngOnInit() {

    this._userService.getAllUsers().subscribe(response => {
      this.allUsers = _.transform(response.users, (results, user) => {
        results.push({
          id: user.id,
          name: user.displayName
        })
      }, []);
    })

    this.passwordForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirm: new FormControl('', [Validators.required, Validators.minLength(8), matchOtherValidator('password')])
    });

    this._sharedDataService.getFeedbackReceipients().subscribe(response => {
      this.feedbackRecipients = response;
    })

  }


  onUserSelect(event) {
    this.userLoaded = false;
    this._userService.getUser(event[0],'?fields=id,displayName,email,firstName,surname,phoneNumber,userCredentials,userGroups,organisationUnits').subscribe(response => {
      this.userLoaded = true;
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

    console.log(payload);
    let feedbackSubject = `${dataStoreKey}:REQUEST TO RESET PASSWORD`;
    let text = `There is request to reset password to ${this.selectedUser.displayName} to ${value.password}`;
    this._dataStoreService
      .createNewKeyAndValue(dataStoreKey, payload)
      .subscribe(response => {

        if (response.ok) {
          this._toastService.success('Your changes were sent for approval, Thanks.')
          this.sendFeedBackMessage(feedbackSubject, text);

        } else {
          this._toastService.error('There was an error when sending data.')

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
    this._messageConversationService.sendFeedBackMessage(payload).subscribe(response => {
      // TODO: Send notification if possible about new message.
      //console.log(response);

    })
  }
  
}
