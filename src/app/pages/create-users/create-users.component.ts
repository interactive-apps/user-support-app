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
