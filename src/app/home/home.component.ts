import { Component, OnInit, Input} from '@angular/core';
import { SharedDataService } from './../shared/shared-data.service';
import { UserService } from './../services/user.service'
import { User } from './../models/user.model';

import {FormDataService} from './../shared/form-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  title = "home";
  private user: User;
  @Input() formData;

  constructor(private _sharedDataService: SharedDataService,
    private _userService: UserService, private _formDataService: FormDataService) {

    }

  ngOnInit() {
    this.formData = this._formDataService.getFormData();
    this._userService.getUserInformation().subscribe(response => {
      this.user = response;
    });
  }

}
