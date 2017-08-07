import { Component, OnInit } from '@angular/core';
import { SharedDataService } from './../shared/shared-data.service';
import { UserService } from './../services/user.service'
import { User } from './../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  private user: User;
  constructor(private _sharedDataService: SharedDataService, private _userService: UserService) { }

  ngOnInit() {


    this._userService.getCurrentUserDatasets().subscribe(response => {
      console.log(response);
    });
  }


  setSelectedOrgunit( value) {
    console.log(value);
  }

}
