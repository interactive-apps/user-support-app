import { Component, EventEmitter, OnInit, ViewChild, Input, Output } from '@angular/core';
import * as _ from 'lodash';
import { OrganisationUnitsService } from '../../../services/organisation-units.service';

@Component({
  selector: 'app-dataset-select',
  templateUrl: './dataset-select.component.html',
  styleUrls: ['./dataset-select.component.css']
})
export class DatasetSelectComponent implements OnInit {

  @Output() onChangeRegistered: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOrgUnitSelect: EventEmitter<boolean> = new EventEmitter<boolean>();
  public isOrganizationUnitSelected: boolean = false;
  public allowSelection: boolean = false;
  public showFilter: boolean = false;
  public autoUpdate: boolean = true;
  public selectedOrgUnitInfo: any;
  public initialDataSets: any;
  public assignedDataSets: any;
  private selected: string;
  private selectedOrgUnitIDs: any;
  public loading: boolean = false;

  public orgunit_model: any = {
    selection_mode: 'orgUnit',
    selected_level: '',
    show_update_button: false,
    selected_group: '',
    orgunit_levels: [],
    orgunit_groups: [],
    selected_orgunits: [],
    user_orgunits: [],
    show_selection_mode: false,
    type: 'report', // can be 'data_entry'
    selected_user_orgunit: 'USER_ORGUNIT'
  };
  constructor(private _organisationUnitsService: OrganisationUnitsService) { }

  ngOnInit() {
  }

  setSelectedOrgunit(event) {
    this.getSelectedDataSets(event.value);
  }

  getSelectedDataSets(orgUnitID: string) {
    this.isOrganizationUnitSelected = true;
    this.onOrgUnitSelect.emit(this.isOrganizationUnitSelected);
    this.loading = true;
    this.showFilter = true;
    this._organisationUnitsService.getOrganisationUnit(orgUnitID).subscribe(response => {
      this.selectedOrgUnitInfo = response;
      this.loading = false;
      this.assignedDataSets = Object.assign([], response.dataSets);
    })
  }


  onDataSetUpdate(event){
    event.selectedOrgUnitInfo = this.selectedOrgUnitInfo;
    this.onChangeRegistered.emit(event);
  }

  filterIsClosed(event) {
    if (event) {
      this.showFilter = false;
    }
  }

}
