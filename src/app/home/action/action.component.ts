import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionType } from './../../models/action-type.model';
import { UserService } from './../../services/user.service';
import { FormDataService }     from './../../shared/form-data.service';
import { StateService}  from "@uirouter/angular";
import { User } from './../../models/user.model';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {

  title = 'action type wizards';
  private currentUser: any = {};
  actionTypeForm: FormGroup;
  choosenAction: ActionType;
  actionTypeArray: string[];

  public actions = [
    { value: 'createUser', display: 'Create User(s)', iconClass: 'fa fa-user-o action__icon' },
    { value: 'writeFeedback', display: 'Write Feedback', iconClass: 'fa fa-pencil-square-o action__icon'},
    { value: 'addForm', display: 'Add Form', iconClass: 'fa fa-wpforms action__icon'}
];

  constructor(public fb: FormBuilder, private _formDataService:FormDataService,
      private _stateService: StateService, private _userService: UserService) {

        _userService.getUserInformation().subscribe(response => {
          this.currentUser = response;
        });
      }

  ngOnInit() {

    this.actionTypeArray = ['Create user', 'Write Feedback', 'Add form'];
    this.choosenAction = this._formDataService.getActionType();

    this.actionTypeForm = this.fb.group({
      actionType: ['', Validators.required]
    });

    this.actionTypeForm.patchValue({
      actionType: this.choosenAction.actionType
    })
  }

  onSubmitNext({ value, valid }: { value: ActionType, valid: boolean }) {
    this._formDataService.setActionType(value);
    this._stateService.go('home.data-sets');
  }

}
