import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { StateService}  from "@uirouter/angular";
import { User } from '../../../models/user.model';
import {UIRouterModule} from "@uirouter/angular";

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {

  title = 'action type wizards';
  private currentUser: any = {};
  actionTypeForm: FormGroup;
  actionTypeArray: string[];


  constructor(public fb: FormBuilder, private _stateService: StateService,
    private _userService: UserService) {

        _userService.getUserInformation().subscribe(response => {
          this.currentUser = response;
        });
      }

  ngOnInit() {
    
  }

}
