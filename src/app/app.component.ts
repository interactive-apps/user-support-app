import { Component, OnInit, Input, ViewContainerRef} from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './services/user.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { User } from './models/user.model';
import { ComposeFeedbackComponent } from './components/messages/compose-feedback/compose-feedback.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public currentUser: any = {};
  public actionTypeForm: FormGroup;
  public actionTypeArray: string[];
  public currentShown:string = 'messages';

  constructor(toastr: ToastsManager, vRef: ViewContainerRef,
              private fb: FormBuilder,
              private _userService: UserService,
              private _dialogService: DialogService){

    toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit() {
    this._userService.getUserInformation().subscribe(response => {
      this.currentUser = response;
    });
  }

  showComposeFeedback(subject?: string, text?: string) {
    this.currentShown = 'messages';
    let disposable = this._dialogService.addDialog(ComposeFeedbackComponent, {
      subject: subject,
      text: text
    })
      .subscribe((isConfirmed) => {

      });
  }

  showChosenComponent(chosenComponent: string){
    this.currentShown = chosenComponent;
  }


}
