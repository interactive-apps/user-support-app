import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { UserService } from './../../services/user.service';
import { IMultiSelectOption,IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import { FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.css']
})

export class AddFormComponent implements OnInit {
  public selectedOrgUnitNames: String[];
  public selectedOrgUnitIDs: String[];
  public isOrganizationUnitSelected: boolean = false;
  public forms: any;
  public optionsModel: String[];
  public myOptions: IMultiSelectOption[];

  // Settings configuration
  public mySettings: IMultiSelectSettings = {
      enableSearch: true,
      buttonClasses: 'btn btn-default btn-block select_btn',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: true
  };

  // Text configuration
  public myTexts: IMultiSelectTexts = {
      checkAll: 'Select all',
      uncheckAll: 'Unselect all',
      checked: 'item selected',
      checkedPlural: 'items selected',
      searchPlaceholder: 'Find',
      searchEmptyResult: 'Nothing found...',
      searchNoRenderText: 'Type in search box to see results...',
      defaultTitle: 'Select forms from the list of data',
      allSelected: 'All selected',
  };

  public formSelectForm: FormGroup;

  constructor(private _userService: UserService) {

  }

  ngOnInit() {

    this._userService.getAllSystemForms().subscribe(response => {
      this.myOptions = _.transform(response.dataSets, function(result, value) {
           result.push({id: value['id'], name:value['displayName']});
         }, []);
    });

  }

  setSelectedOrgunit(event){

    this.selectedOrgUnitIDs = _.map(event.value, 'id');
    this.selectedOrgUnitNames = _.map(event.value, 'name');

    if(event.value.length >= 1){
      this.isOrganizationUnitSelected = true;
    }

  }


  onChange() {
    
  }


  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    let payload = {
      selectedOrgUnitIDs: this.selectedOrgUnitIDs,
      selectedFormsIDs: value.selectedFormsIDs
    };
    // TODO: API call to send the payload
  }

}
