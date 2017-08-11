import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from './../../models/message.model';
import { ActionType } from './../../models/action-type.model';
import { FormDataService }     from './../../shared/form-data.service';
import { UserService } from './../../services/user.service';
import { StateService}  from "@uirouter/angular";

@Component({
  selector: 'app-data-sets',
  templateUrl: './data-sets.component.html',
  styleUrls: ['./data-sets.component.css']
})
export class DataSetsComponent implements OnInit {

  choosenAction: ActionType;
  isWritingFeedback: boolean = false;
  isAddingForm: boolean = false;
  isCreatingUser: boolean = false;
  currentUserDataSets: any;
  loading: boolean = true;
  dataLoaded: boolean = false;


  constructor(public fb: FormBuilder, private _formDataService: FormDataService,
    private _stateService: StateService, private _userService: UserService) {

    this._userService.getCurrentUserDatasets().subscribe(response => {
      this.currentUserDataSets = response;
      this.loading = false;
      this.dataLoaded = true;
      console.log(response)
    });
  }

  ngOnInit() {
    this.choosenAction = this._formDataService.getActionType();

    if(this.choosenAction.actionType == 'writeFeedback') {
      this.isWritingFeedback = true;
    }else if(this.choosenAction.actionType == 'addForm') {
      this.isAddingForm = true;
    }else if (this.choosenAction.actionType === 'createUser') {
      this.isCreatingUser = true;
    } else {
      this._stateService.go('home.action');
    }
  }

}
