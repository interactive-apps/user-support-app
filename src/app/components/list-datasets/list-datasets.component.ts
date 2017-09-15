import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import { DataSetsService } from '../../services/data-sets.service';
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

  public payload:any;
  public isOrganizationUnitSelected: boolean = false;
  public forms: any;
  public loading: boolean = false;
  public optionsModel: string[];
  public initialDataSets: string[];
  public disableRequestToApproval: boolean = true;
  public myOptions: IMultiSelectOption[];
  private addedOrgDataSets: string [];
  private removedOrgDataSets: string [];
  private allDataSets: object [];

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

  constructor(private _organisationUnitsService: OrganisationUnitsService,
              private _dataSetsService: DataSetsService) { }

  ngOnInit() {

    this._dataSetsService.getAllDataSets().subscribe(response => {
      this.allDataSets = response.dataSets;
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
        this.initialDataSets = _.map(response.dataSets, 'id');
        this.optionsModel = Object.assign([], this.initialDataSets);
      })
    }
  }

  onDataSetSelectChange(event){
    this.addedOrgDataSets = _.difference(event,this.initialDataSets);
    this.removedOrgDataSets = _.difference(this.initialDataSets,event);
    if( this.addedOrgDataSets.length || this.removedOrgDataSets.length ){
      this.disableRequestToApproval = false;
    } else {
      this.disableRequestToApproval = true;
    }

  }


  formatDataStorePayload(){

    let dataSetOrgUnitAdded = []
    let dataSetOrgUnitRemoved = []

    // Create payload array for added forms to the organisations
    if(this.addedOrgDataSets.length){
      // Get full objects for all added dataset
      dataSetOrgUnitAdded = _.filter(this.allDataSets, (dataSet) => {
        return _.includes(this.addedOrgDataSets, dataSet.id);
      });

      // Add organisationUnit to all dataset that have been added to the org unit.
      dataSetOrgUnitAdded  = _.transform(dataSetOrgUnitAdded,(result, dataset) =>{
        dataset.organisationUnits.push({id: this.selected})

        // name and periodType are requeired for any PUT payload created to the dataset
        result.push(_.pick(dataset, ['id','name', 'periodType','organisationUnits']));
      },[])
    }

    // Create payload array for removed forms to the organisations
    if(this.removedOrgDataSets.length){
      // Get full objects for all removed dataset
      dataSetOrgUnitRemoved = _.filter(this.allDataSets, (dataSet) =>{
        return _.includes(this.removedOrgDataSets, dataSet.id);
      })
      // Remove organisationUnit to all dataset that have been removed to the org unit.
      dataSetOrgUnitRemoved  = _.transform(dataSetOrgUnitRemoved,(result, dataset) =>{
        // Remove organisationUnit from dataSets.
        dataset.organisationUnits = _.filter(dataset.organisationUnits,(orgUnit) => {
          return orgUnit.id !== this.selected;
        })
        // name and periodType are requeired for any PUT payload created to the dataset
        result.push(_.pick(dataset, ['id','name', 'periodType','organisationUnits']));

      },[])
    }


    return _.concat(dataSetOrgUnitAdded, dataSetOrgUnitRemoved);

  }

  createDataStoreObjKey(){

    let formatter = new Intl.DateTimeFormat("fr", { month: "short" }),
        month = formatter.format(new Date())

    return month.slice(0, -1).concat('_',Math.random().toString(36).substr(2,3));

  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {

    let formatedDataStoreData = this.formatDataStorePayload();
    let dataStoreKey = this.createDataStoreObjKey();

    // TODO: API call to send the payload to the datastore
    

  }

}
