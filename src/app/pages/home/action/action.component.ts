import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { StateService}  from "@uirouter/angular";
import { DialogService } from 'ng2-bootstrap-modal';
import { User } from '../../../models/user.model';
import { UIRouterModule } from "@uirouter/angular";
import { ComposeFeedbackComponent } from '../messages/compose-feedback/compose-feedback.component';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {

  title = 'action type wizards';
  public currentUser: any = {};
  actionTypeForm: FormGroup;
  actionTypeArray: string[];


  constructor(private fb: FormBuilder,
              private _stateService: StateService,
              private _userService: UserService,
              private _dialogService: DialogService) {

        _userService.getUserInformation().subscribe(response => {
          this.currentUser = response;
        });
      }

  ngOnInit() {

  }

  showComposeFeedback(subject?: string, text?: string) {
    let disposable = this._dialogService.addDialog(ComposeFeedbackComponent, {
      subject: subject,
      text: text
    })
      .subscribe((isConfirmed) => {

      });
  }

}
