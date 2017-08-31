import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { FormControl, FormGroup } from '@angular/forms';

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

  constructor() { }

  ngOnInit() {

    this.userDetails = new FormGroup({
      firstName: new FormControl(''),
      surname: new FormControl(''),
      email: new FormControl(''),
      phoneNumber: new FormControl(''),
      userCredentials: new FormGroup({
        username: new FormControl(''),
        password: new FormControl(''),
        confirm: new FormControl('')
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
