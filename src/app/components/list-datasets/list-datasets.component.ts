import {Component, OnInit, ViewChild, Input, ViewContainerRef} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import { DataSetsService } from '../../services/data-sets.service';
import { OrganisationUnitsService } from './../../services/organisation-units.service';
import { DataStoreService } from '../../services/data-store.service';
import { SharedDataService } from '../../shared/shared-data.service';
import { MessageConversationService } from '../../services/message-conversation.service';
import { IMultiSelectOption,IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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
  private feedbackRecipients: any;

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
              private _dataSetsService: DataSetsService,
              private _dataStoreService: DataStoreService,
              private _messageConversationService: MessageConversationService,
              private _sharedDataService: SharedDataService,
              public toastr: ToastsManager, vcr: ViewContainerRef) {
                console.log(vcr);
                //this.toastr.setRootViewContainerRef(vcr);
              }

  ngOnInit() {

    this._dataSetsService.getAllDataSets().subscribe(response => {
      this.allDataSets = response.dataSets;
      this.myOptions = _.transform(response.dataSets, function(result, value) {
           result.push({id: value['id'], name:value['displayName']});
         }, []);
    });

    this._sharedDataService.getFeedbackReceipients().subscribe(response =>{
      this.feedbackRecipients = response;
    })

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
        let datasetUrlTosendTo = `api/dataSets/${dataset.id}`;

        dataset.organisationUnits.push({id: this.selected})

        // name and periodType are requeired for any PUT payload created to the dataset
        result.push({
          url: datasetUrlTosendTo,
          method: 'PUT',
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
        let datasetUrlTosendTo = `api/dataSets/${dataset.id}`
        // Remove organisationUnit from dataSets.
        dataset.organisationUnits = _.filter(dataset.organisationUnits,(orgUnit) => {
          return orgUnit.id !== this.selected;
        })
        // name and periodType are requeired for any PUT payload created to the dataset
        result.push({
          url: datasetUrlTosendTo,
          method: 'PUT',
          payload: _.pick(dataset, ['id','name', 'periodType','organisationUnits'])
        });

      },[])
    }


    return _.concat(dataSetOrgUnitAdded, dataSetOrgUnitRemoved);

  }

  showSuccessToast(message: string) {
       this.toastr.success(message, 'Success!');
     }

showErrorToast(message: string) {
       this.toastr.error(message, 'Oops!');
     }

  createDataStoreObjKey(){

    let formatter = new Intl.DateTimeFormat("fr", { month: "short" }),
        month = formatter.format(new Date())

    return month.slice(0, -1).concat('_',Math.random().toString(36).substr(2,3));

  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {

    let formatedDataStoreData = this.formatDataStorePayload();
    let dataStoreKey = this.createDataStoreObjKey();
    let feedbackSubject = `${dataStoreKey}:REQUEST FOR APROVAL CHANGE IN DATASET`;
    let text = `There is request to update datasets to xxx orgnisation unit, yyy,zzz were removed and xxx,s were added`;
    this.disableRequestToApproval = true;
    this._dataStoreService
        .createNewKeyAndValue(dataStoreKey,formatedDataStoreData)
        .subscribe(response =>{
          // TODO: Dispaly Toast after success
          if(response.ok){

            this.disableRequestToApproval = true;
            this.sendFeedBackMessage(feedbackSubject, text);

          } else {

            this.disableRequestToApproval = false;

          }
        });


  }
  
  sendFeedBackMessage(subject,message){
    let payload = {
      subject: subject,
      text: message,
      userGroups: [{id: this.feedbackRecipients.id}]
    }
    this._messageConversationService.sendFeedBackMessage(payload).subscribe(response =>{
      console.log(response);
    })

  }

}
