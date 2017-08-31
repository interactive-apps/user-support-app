import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.css']
})
export class AddFormComponent implements OnInit {
  public selectedOrgUnitNames: String[];
  public selectedOrgUnitIDs: String[];
  public isOrganizationUnitSelected: boolean = false;

 // These changes the behaviour of the tree component
  public orgunit_tree_config: any = {
    show_search : true,
    search_text : 'Search',
    level: null,
    loading: true,
    loading_message: 'Loading Organisation units...',
    multiple: false,
    multiple_key:"none", //can be control or shift
    placeholder: "Select Organisation Unit"
  };

  constructor() { }

  ngOnInit() {

  }

  setSelectedOrgunit(event){
    this.selectedOrgUnitIDs = _.map(event.value, 'id');
    this.selectedOrgUnitNames = _.map(event.value, 'name');

    if(event.value.length >= 1){
      this.isOrganizationUnitSelected = true;
    }

  }

}
