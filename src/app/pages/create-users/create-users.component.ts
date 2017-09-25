import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { matchOtherValidator } from '../../shared/match-other-validator'
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SharedDataService } from '../../shared/shared-data.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { DataStoreService } from '../../services/data-store.service';
import { MessageConversationService } from '../../services/message-conversation.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

import * as _ from 'lodash';
import * as async from 'async-es';

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrls: ['./create-users.component.css']
})
export class CreateUsersComponent implements OnInit {

  public selectedOrgUnitNames: String[];
  public selectedOrgUnitIDs: any;
  public allUserGroups: any;
  public allUserRoles: any;
  public isOrganizationUnitSelected: boolean = false;
  private randomGeneratedID: string;
  private feedbackRecipients: any;
  public userDetails: FormGroup;

  public orgunit_tree_config: any = {
    show_search: true,
    search_text: 'Search',
    level: null,
    loading: true,
    loading_message: 'Loading Organisation units...',
    multiple: true,
    multiple_key: "none", //can be control or shift
    placeholder: "Select Organisation Unit"
  };

  public orgunit_model: any = {
    selection_mode: "orgUnit",
    selected_level: "",
    show_update_button: true,
    selected_group: "",
    orgunit_levels: [],
    orgunit_groups: [],
    selected_orgunits: [],
    user_orgunits: [],
    type: "report", // can be 'data_entry'
    selected_user_orgunit: "USER_ORGUNIT"
  };

  // Settings configuration
  public mySettings: IMultiSelectSettings = {
    enableSearch: true,
    buttonClasses: 'btn btn-secondary btn-sm btn-block',
    containerClasses: 'dropdown-block',
    dynamicTitleMaxItems: 6,
    displayAllSelectedText: true
  };

  // Text configuration
  public myTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'userGrops selected',
    checkedPlural: 'userGroups selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'Select user groups user belongs',
    allSelected: 'All selected',
  };


  constructor(private _dataStoreService: DataStoreService,
    private _sharedDataService: SharedDataService,
    private _toastService: ToastService,
    private _messageConversationService: MessageConversationService,
    private _userService: UserService) { }

  ngOnInit() {

    this.userDetails = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.minLength(2)]),
      phoneNumber: new FormControl('', [Validators.minLength(2)]),
      userGroups: new FormControl(''),
      userCredentials: new FormGroup({
        userRoles: new FormControl(''),
        username: new FormControl('', [Validators.required, Validators.minLength(2)]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        confirm: new FormControl('', [Validators.required, Validators.minLength(8), matchOtherValidator('password')])
      })
    });

    /**
     * [asyc.parallel parallel call multiple request]
     * @param  {[function]} [(callback [callback function]
     */
    async.parallel([
      (callback) => {
        this._sharedDataService.getFeedbackReceipients().subscribe(response => {
          callback(null, response)
        })
      },
      (callback) => {
        this._sharedDataService.getRandomGeneratedId().subscribe(response => {
          callback(null, response)
        })
      },
      (callback) => {
        this._userService.getAllUserGroups().subscribe(response => {
          callback(null, response)
        })
      },
      (callback) => {
        this._userService.getAllUserRoles().subscribe(response => {
          callback(null, response)
        })
      }
    ], (error, results) => {
      this.feedbackRecipients = results[0];
      this.randomGeneratedID = results[1];

      this.allUserGroups = _.transform(results[2].userGroups, (results, userGroup) => {
        results.push({
          id: userGroup.id,
          name: userGroup.displayName
        })
      }, []);

      this.allUserRoles = _.transform(results[3].userRoles, (results, userRole) => {
        results.push({
          id: userRole.id,
          name: userRole.displayName
        })
      }, []);

    })
  }

  /**
   * [setSelectedOrgunit set all selected organisationUnits]
   * @param  {[Any]} event [description]
   * @return {[type]}       [description]
   */
  setSelectedOrgunit(event) {
    this.selectedOrgUnitIDs = _.transform(event.value, (results, value) => {
      results.push(_.pick(value, 'id'));
    }, []);

    this.selectedOrgUnitNames = _.map(event.value, 'name');

    if (event.value.length >= 1) {
      this.isOrganizationUnitSelected = true;
    }

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

  /**
   * [onSubmit description]
   * @param  {[type]}     {value [description]
   * @param  {User}       valid} [description]
   * @param  {boolean }}    valid         [description]
   * @return {[type]}            [description]
   */
  onSubmit({ value, valid }: { value: User, valid: boolean }) {
    let userPayload = Object.assign({}, value);
    userPayload.organisationUnits = this.selectedOrgUnitIDs;
    userPayload.id = this.randomGeneratedID;
    
    userPayload.userCredentials.userRoles = _.transform(value.userCredentials.userRoles,
        (result, userRoleID) => {
          if(userRoleID.length) {
            result.push({
              id: userRoleID
            })
          }
    }, []);

    userPayload.userGroups = _.transform(value.userGroups, (result, userGroupID) => {
      if (userGroupID.length) {
        result.push({
          id: userGroupID
        })
      };
    },[]);

    userPayload.userCredentials.userInfo = {
      id: this.randomGeneratedID
    }
    console.log(userPayload);
    let dataStoreKey = this.createDataStoreObjKey();
    let datasetUrlTosendTo = `api/users`;
    let payload = [{
      url: datasetUrlTosendTo,
      method: 'POST',
      status: 'OPEN',
      action: `Add ${value.firstName} ${value.surname} as a user.`,
      payload: userPayload
    }];

    let feedbackSubject = `${dataStoreKey}:REQUEST FOR CREATING USER`;
    let text = `There is request to create user to ${this.selectedOrgUnitNames} orgnisation unit, with the following information`;
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
