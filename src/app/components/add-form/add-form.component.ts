import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.css']
})

export class AddFormComponent implements OnInit {
  public selectedOrgUnitIDs: String;


  constructor() {

  }

  ngOnInit() {

  }

  setSelectedOrgunit(event){

    //this.selectedOrgUnitIDs = _.map(event.value, 'id');
    this.selectedOrgUnitIDs = event.value;

  }


  onChange() {

  }

}
