import { Component, OnInit, Input} from '@angular/core';
import { SharedDataService } from './../../shared/shared-data.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

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
              private _userService: UserService) {

    }

  ngOnInit() {
    this._userService.getUserInformation().subscribe(response => {
      this.user = response;
    });
  }

}
