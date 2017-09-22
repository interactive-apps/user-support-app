import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { matchOtherValidator } from '../../shared/match-other-validator'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from '../../shared/shared-data.service';
import { ToastService } from '../../services/toast.service';
import { DataStoreService } from '../../services/data-store.service';
import { MessageConversationService } from '../../services/message-conversation.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrls: ['./create-users.component.css']
})
export class CreateUsersComponent implements OnInit {

  public selectedOrgUnitNames: String[];
  public selectedOrgUnitIDs: any;
  public isOrganizationUnitSelected: boolean = false;
  private feedbackRecipients: any;
  public userDetails: FormGroup;

  public orgunit_tree_config: any = {
    show_search : true,
    search_text : 'Search',
    level: null,
    loading: true,
    loading_message: 'Loading Organisation units...',
    multiple: true,
    multiple_key:"none", //can be control or shift
    placeholder: "Select Organisation Unit"
  };

  public orgunit_model: any =  {
    selection_mode: "orgUnit",
    selected_level: "",
    show_update_button:true,
    selected_group: "",
    orgunit_levels: [],
    orgunit_groups: [],
    selected_orgunits: [],
    user_orgunits: [],
    type:"report", // can be 'data_entry'
    selected_user_orgunit: "USER_ORGUNIT"
  };


  constructor(private _dataStoreService: DataStoreService,
              private _sharedDataService: SharedDataService,
              private _toastService: ToastService,
              private _messageConversationService: MessageConversationService) { }

  ngOnInit() {

    this.userDetails = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.minLength(2)]),
      phoneNumber: new FormControl('', [Validators.minLength(2)]),
      userCredentials: new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(2)]),
        password: new FormControl('', [Validators.required, Validators.minLength(2)]),
        confirm: new FormControl('', [Validators.required, Validators.minLength(2),matchOtherValidator('password')])
      })
    });

    this._sharedDataService.getFeedbackReceipients().subscribe(response =>{
      this.feedbackRecipients = response;
    })

  }

  setSelectedOrgunit(event){
    this.selectedOrgUnitIDs = _.transform(event.value,(results,value) => {
      results.push(_.pick(value,'id'));
    },[]);

    this.selectedOrgUnitNames = _.map(event.value, 'name');

    if(event.value.length >= 1){
      this.isOrganizationUnitSelected = true;
    }

  }

  createDataStoreObjKey(){

    let formatter = new Intl.DateTimeFormat("fr", { month: "short" }),
        month = formatter.format(new Date()),
        text = '',
        possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(let i=0; i < 3; i++){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return month.slice(0, -1).toUpperCase().concat('_',text);

  }

  onSubmit({ value, valid }: { value: User, valid: boolean }) {
    value.organisationUnits = this.selectedOrgUnitIDs;
    let dataStoreKey = this.createDataStoreObjKey();

    let datasetUrlTosendTo = `api/users`;
    let payload = [{
      url: datasetUrlTosendTo,
      method: 'POST',
      status: 'OPEN',
      action: `Add ${value.firstName} ${value.surname} as a user.`,
      payload: value
    }];

    let feedbackSubject = `${dataStoreKey}:REQUEST FOR CREATING USER`;
    let text = `There is request to create user to ${this.selectedOrgUnitNames} orgnisation unit, with the following information`;
    this._dataStoreService
        .createNewKeyAndValue(dataStoreKey,payload)
        .subscribe(response =>{

          if(response.ok){
            this._toastService.success('Your changes were sent for approval, Thanks.')
            this.sendFeedBackMessage(feedbackSubject, text);

          } else {
            this._toastService.error('There was an error when sending data.')

          }
        });
  }

  sendFeedBackMessage(subject,message){
    let payload = {
      subject: subject,
      text: message,
      userGroups: [{id: this.feedbackRecipients.id}]
    }
    this._messageConversationService.sendFeedBackMessage(payload).subscribe(response =>{
      // TODO: Send notification if possible about new message.
      //console.log(response);

    })

  }

}
