import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Message } from './../../models/message.model';
import { ActionType } from './../../models/action-type.model';
import { FormDataService }     from './../../shared/form-data.service';
import { UserService } from './../../services/user.service';
import { StateService}  from "@uirouter/angular";
import * as _ from 'lodash';

@Component({
  selector: 'app-data-sets',
  templateUrl: './data-sets.component.html',
  styleUrls: ['./data-sets.component.css']
})
export class DataSetsComponent implements OnInit {

  choosenAction: ActionType;
  isWritingFeedback: boolean = false;
  isAddingForm: boolean = false;
  isCreatingUser: boolean = true;
  currentUserDataSets: any;
  loading: boolean = true;
  dataLoaded: boolean = false;
  allFormsForUser: any = {};
  chosenOrgUniassignedForms: any = {};

  public myForm: FormGroup;



  constructor(public fb: FormBuilder, private _formDataService: FormDataService,
    private _stateService: StateService, private _userService: UserService, private _fb: FormBuilder) {

    this._userService.getCurrentUserDatasets().subscribe(response => {
      this.currentUserDataSets = response;
      this.loading = false;
      this.dataLoaded = true;
      this.manipulateData(response)
    });

    this.myForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      addresses: this._fb.array([
        this.initForm(),
      ])
    });
  }

  ngOnInit() {
    this.choosenAction = this._formDataService.getActionType();

    if (this.choosenAction.actionType == 'writeFeedback') {
      this.isWritingFeedback = true;
    } else if (this.choosenAction.actionType == 'addForm') {
      this.isAddingForm = true;
    } else if (this.choosenAction.actionType === 'createUser') {
      this.isCreatingUser = true;
    } else {
      //this._stateService.go('home.action');
      //console.log("hurray");
    }
  }

  initForm() {
    return this._fb.group({
      street: ['', Validators.required],
      postcode: ['']
    });
  }


  manipulateData(data) {

    let result = _.map(data.forms, function(value, identifier) {
      return { id: identifier, label: value.label };
    });

    this.allFormsForUser = result;
    let arrayOfOrgs = _.toArray(data.organisationUnits);

    this.returnAllUniassignedForms(arrayOfOrgs[1]);

  }

  setSelectedOrgunit(evt){
    console.log(evt);
  }


  returnAllUniassignedForms(organisationUnit) {

    this.chosenOrgUniassignedForms = this.allFormsForUser.filter(function(obj) {

      return !_.some(organisationUnit.dataSets, obj);

    });

  }

}
