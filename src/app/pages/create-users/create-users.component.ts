import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as _ from 'lodash';

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrls: ['./create-users.component.css']
})
export class CreateUsersComponent implements OnInit {

  public selectedOrgUnitNames: String[];
  public selectedOrgUnitIDs: String[];
  public isOrganizationUnitSelected: boolean = false;
  userDetails: FormGroup;

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


  constructor() { }

  ngOnInit() {

    this.userDetails = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.minLength(2)]),
      phoneNumber: new FormControl('', [Validators.minLength(2)]),
      userCredentials: new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(2)]),
        password: new FormControl('', [Validators.required, Validators.minLength(2)]),
        confirm: new FormControl('', [Validators.required, Validators.minLength(2)])
      })
    });
  }

  setSelectedOrgunit(event){
    this.selectedOrgUnitIDs = _.map(event.value, 'id');
    this.selectedOrgUnitNames = _.map(event.value, 'name');

    if(event.value.length >= 1){
      this.isOrganizationUnitSelected = true;
    }

  }



  onSubmit({ value, valid }: { value: User, valid: boolean }) {
    value.organisationUnits = this.selectedOrgUnitIDs;
    console.log(value, valid);
  }

}
