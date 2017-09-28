import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { EmailMessage } from '../../../models/email-message.model';
import { Message } from '../../../models/message.model';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { MessageConversationService } from '../../../services/message-conversation.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-compose-message',
  templateUrl: './compose-message.component.html',
  styleUrls: ['./compose-message.component.css']
})
export class ComposeMessageComponent extends DialogComponent<EmailMessage, boolean> implements EmailMessage {

  subject: string;
  text: string;
  emailComposeForm: FormGroup;
  selectedOrganisationUnits: any;
  public users: any;
  public userGroups: any;
  public selectedUsers: any;
  public selectedUserGroups: any;
  public optionsModel: String[];
  public myOptions: IMultiSelectOption[];

  // Settings configuration
  public mySettings: IMultiSelectSettings = {
    enableSearch: true,
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 4,
    displayAllSelectedText: true
  };

  // Text configuration
  public myTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'User selected',
    checkedPlural: 'Users selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'User not found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'Select User to send email',
    allSelected: 'All selected',
  };

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


  constructor(public fb: FormBuilder, dialogService: DialogService,
    public _userService: UserService, public _messageConversationService: MessageConversationService) {
    super(dialogService)
  }

  ngOnInit() {

    this.emailComposeForm = this.fb.group({
      subject: ['', Validators.required],
      text: ['', Validators.required],
      users: ['', Validators.required],
      userGroups: ['', Validators.required]
    });

    this.emailComposeForm.patchValue({
      subject: this.subject,
      text: this.text,
      users: this.users
    });

    this.emailComposeForm.controls['users'].valueChanges
      .subscribe((selectedOptions) => {
        this.selectedUsers = _.intersection(selectedOptions, this.users);
        this.selectedUserGroups = _.intersection(selectedOptions, this.userGroups);
      });


    this._userService.getAllUsers().flatMap(data1 => {
      return Observable.forkJoin([Observable.of(data1),
      this._userService.getAllUserGroups()]);
    }).subscribe(result => {
      this.users = _.map(result[0].users, 'id');
      this.userGroups = _.map(result[1].userGroups, 'id');
      this.myOptions = _.transform(_.concat(result[0].users, result[1].userGroups), (result, value) => {
        result.push({ id: value['id'], name: value['displayName'] });
      }, []);
    });


  }


  setSelectedOrgunit(event) {
    this.selectedOrganisationUnits = _.transform(event.value, (result, value)=>{
      result.push({id: value['id']})
    },[]);
  }


  onSendEmail({ value, valid }: { value: Message, valid: boolean }) {
    value.users = _.transform(this.selectedUsers,(result,value)=>{
      result.push({id: value})
    },[]);
    value.userGroups = _.transform(this.selectedUserGroups,(result,value)=>{
      result.push({id: value})
    },[]);
    value.organisationUnits = this.selectedOrganisationUnits;
    this._messageConversationService.create(value);
    this.close();
  }

}
