import {Component, EventEmitter, OnInit, ViewChild, Input, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import { DataSetsService } from '../../services/data-sets.service';
import { OrganisationUnitsService } from './../../services/organisation-units.service';
import { MessageConversationService } from '../../services/message-conversation.service';
import { DataStoreService } from '../../services/data-store.service';
import { SharedDataService } from '../../shared/shared-data.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.css']
})

export class AddFormComponent implements OnInit {

  @Output() onDataStoreUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFiltersClosed: EventEmitter<any> = new EventEmitter<any>();
  @Input()  activeComponent: string;
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
  public showFilter: boolean = false;
  private selected: string;
  private addedOrgDataSets: string [];
  private removedOrgDataSets: string [];
  private allDataSets: object [];
  private feedbackRecipients: any;
  private AddedFormsNames: string [] = [];
  private RemovedFormsNames: string [] = [];
  private firstClick: boolean;
  
  public orgunit_model: any =  {
    selection_mode: "Usr_orgUnit",
    selected_level: "",
    show_update_button:false,
    selected_group: "",
    orgunit_levels: [],
    orgunit_groups: [],
    selected_orgunits: [],
    user_orgunits: [],
    show_selection_mode: false,
    type:"report", // can be 'data_entry'
    selected_user_orgunit: "USER_ORGUNIT"
  };

  constructor(private _organisationUnitsService: OrganisationUnitsService,
              private _dataSetsService: DataSetsService,
              private _dataStoreService: DataStoreService,
              private _sharedDataService: SharedDataService,
              private _messageConversationService: MessageConversationService,
              private _toastService: ToastService) {}

  ngOnInit() {
    this.firstClick = true;
    this._dataSetsService.getAllDataSets().subscribe(response => {
      this.allDataSets = response.dataSets;
    });

    this._sharedDataService.getFeedbackReceipients().subscribe(response =>{
      this.feedbackRecipients = response;
    })
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
    this.showFilter = true;
    this.selected = orgUnitID;
    this._organisationUnitsService.getOrganisationUnit(orgUnitID).subscribe(response =>{
      this.selectedOrgUnitInfo = response;
      this.loading = false;
      this.initialDataSets = _.map(response.dataSets, 'id');
      this.assignedDataSets = Object.assign([], response.dataSets);
    })
  }


  dataUpdated(event){

    let selectedDatasets = event.selectedData.value.split(';');
    this.addedOrgDataSets = _.difference(selectedDatasets,this.initialDataSets);
    this.removedOrgDataSets = _.difference(this.initialDataSets,selectedDatasets);
    if( this.addedOrgDataSets.length || this.removedOrgDataSets.length ){
      this.disableRequestToApproval = false;
    } else {
      this.disableRequestToApproval = true;
    }

    let formatedDataStoreData = this.formatDataStorePayload();
    let dataStoreKey = this.createDataStoreObjKey();

    let addedFormsNames = this.AddedFormsNames.length ? this.AddedFormsNames.join() : 'None';
    let removedFormsNames = this.RemovedFormsNames.length ? this.RemovedFormsNames.join() : 'None';

    let feedbackSubject = `${dataStoreKey}:REQUEST FOR APROVAL CHANGE IN DATASET`;
    let text = `There is request to update datasets to ${this.selectedOrgUnitInfo.name} orgnisation unit, ${addedFormsNames} were added and ${removedFormsNames} were removed`;
    this.disableRequestToApproval = true;

    this._dataStoreService
        .createNewKeyAndValue(dataStoreKey,formatedDataStoreData)
        .subscribe(response =>{

          if(response.ok){

            this.disableRequestToApproval = true;
            this._toastService.success('Your changes were sent for approval, Thanks.')
            this.sendFeedBackMessage(feedbackSubject, text);
            this.onDataStoreUpdate.emit({
              updated: true
            });

          } else {
            this._toastService.error('There was an error when sending data.')
            this.disableRequestToApproval = false;
            this.onDataStoreUpdate.emit({
              updated: false
            });

          }
        });
  }


  filterIsClosed(event) {
    if(event){
      this.showFilter = false;
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
        let datasetUrlTosendTo = `api/dataSets/${dataset.id}`;
        this.AddedFormsNames.push(dataset.name);
        dataset.organisationUnits.push({id: this.selected})

        // name and periodType are requeired for any PUT payload created to the dataset
        result.push({
          url: datasetUrlTosendTo,
          method: 'PUT',
          status: 'OPEN',
          action: `Add ${dataset.name} form.`,
          payload: _.pick(dataset, ['id','name', 'periodType','organisationUnits'])
        });

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
        let datasetUrlTosendTo = `api/dataSets/${dataset.id}`;
        this.RemovedFormsNames.push(dataset.name);
        // Remove organisationUnit from dataSets.
        dataset.organisationUnits = _.filter(dataset.organisationUnits,(orgUnit) => {
          return orgUnit.id !== this.selected;
        })
        // name and periodType are requeired for any PUT payload created to the dataset
        result.push({
          url: datasetUrlTosendTo,
          method: 'PUT',
          status: 'OPEN',
          action: `Remove ${dataset.name} form.`,
          payload: _.pick(dataset, ['id','name', 'periodType','organisationUnits'])
        });

      },[])
    }


    return _.concat(dataSetOrgUnitAdded, dataSetOrgUnitRemoved);

  }

  createDataStoreObjKey(){

    let formatter = new Intl.DateTimeFormat("fr", { month: "short" }),
        month = formatter.format(new Date()),
        text = '',
        possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(let i=0; i < 3; i++){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return month.slice(0, -1).toUpperCase().concat('_',text);

  }

  sendFeedBackMessage(subject,message){
    let payload = {
      subject: subject,
      text: message,
      userGroups: [{id: this.feedbackRecipients.id}]
    }
    this._messageConversationService.sendFeedBackMessage(payload).subscribe(response =>{
      // TODO: Send notification if possible about new message.
      //console.log(response);

    })

  }
  // TODO: (barnabas) find better way to prevent close on clicking add form buttons.
  clickOutside(event){
    if(!this.firstClick && event){
      this.onFiltersClosed.emit({
        closed: true
      });
    }
    this.firstClick = false;
  }

}
