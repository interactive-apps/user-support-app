import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import { UserService } from './../../services/user.service';
import { OrganisationUnitsService } from './../../services/organisation-units.service';
import { IMultiSelectOption,IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import { FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-list-datasets',
  templateUrl: './list-datasets.component.html',
  styleUrls: ['./list-datasets.component.css']
})
export class ListDatasetsComponent implements OnInit {
  @Input() selected: string;

  public payload: any;
  public isOrganizationUnitSelected: boolean = false;
  public forms: any;
  public loading: boolean = false;
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
      checked: 'dataSet selected',
      checkedPlural: 'dataSets selected',
      searchPlaceholder: 'Find',
      searchEmptyResult: 'Nothing found...',
      searchNoRenderText: 'Type in search box to see results...',
      defaultTitle: 'Select forms from the',
      allSelected: 'All selected',
  };

  public formSelectForm: FormGroup;

  constructor(private _userService: UserService,
              private _organisationUnitsService: OrganisationUnitsService) { }

  ngOnInit() {

    this._userService.getAllSystemForms().subscribe(response => {
      this.myOptions = _.transform(response.dataSets, function(result, value) {
           result.push({id: value['id'], name:value['displayName']});
         }, []);
    });

  }

  ngOnChanges() {
    if(this.selected && this.selected.length){
      this.isOrganizationUnitSelected = true;
      this.loading = true;
      this._organisationUnitsService.getOrganisationUnit(this.selected).subscribe(response =>{
        this.loading = false;
        this.optionsModel = _.map(response.dataSets, 'id');
        this.payload = _.pick(response, ['name', 'shortName', 'openingDate', 'dataSets']);
      })
    }
  }

  onDataSetSelectChange(event){
    console.log(event);
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    let newDataSets =  _.transform(value.selectedFormsIDs, (result, value)=>{
        result.push({id: value})
      },[]);
    this.payload.dataSets = newDataSets;
    // TODO: API call to send the payload

    this._organisationUnitsService.updatedOrgUnitdatasets(this.selected,this.payload)
      .subscribe(response =>{
      console.log(response);
    })
  }

}
