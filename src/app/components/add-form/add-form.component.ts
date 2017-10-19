import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import { DataSetsService } from '../../services/data-sets.service';
import { OrganisationUnitsService } from './../../services/organisation-units.service';
import { DataStoreService } from '../../services/data-store.service';
import { SharedDataService } from '../../shared/shared-data.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.css']
})

export class AddFormComponent implements OnInit {
  public selectedOrgUnitIDs: String;
  public payload:any;
  public isOrganizationUnitSelected: boolean = false;
  public allowSelection: boolean = false;
  public selectedOrgUnitInfo: any;
  public forms: any;
  public loading: boolean = false;
  public assignedDataSets: string[] = [];
  public initialDataSets: string[];
  public disableRequestToApproval: boolean = true;

  constructor(private _organisationUnitsService: OrganisationUnitsService,
              private _dataSetsService: DataSetsService,
              private _dataStoreService: DataStoreService,
              private _sharedDataService: SharedDataService,
              private _toastService: ToastService) {}

  ngOnInit() {

  }

  setSelectedOrgunit(event) {

    //this.selectedOrgUnitIDs = _.map(event.value, 'id');
    this.selectedOrgUnitIDs = event.value;
    this.getSelectedDataSets(event.value);

  }


  onChange() {

  }


  getSelectedDataSets(orgUnitID:string){
    this.isOrganizationUnitSelected = true;
    this.loading = true;
    this._organisationUnitsService.getOrganisationUnit(orgUnitID).subscribe(response =>{
      this.selectedOrgUnitInfo = response;
      this.loading = false;
      this.initialDataSets = _.map(response.dataSets, 'id');
      this.assignedDataSets = Object.assign([], response.dataSets);
    })
  }

}
