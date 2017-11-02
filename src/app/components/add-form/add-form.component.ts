import { Component, EventEmitter, OnInit, ViewChild, Input, Output } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { DataSetsService } from '../../services/data-sets.service';
import { OrganisationUnitsService } from './../../services/organisation-units.service';
import { MessageConversationService } from '../../services/message-conversation.service';
import { DataStoreService } from '../../services/data-store.service';
import { SharedDataService } from '../../shared/shared-data.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-form',
  moduleId: module.id,
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.css']
})

export class AddFormComponent implements OnInit {

  @Output() onDataStoreUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFiltersClosed: EventEmitter<any> = new EventEmitter<any>();
  @Input()  activeComponent: string;
  @Input()  isOrganizationUnitSelected: boolean = false;
  public isSendingDataToDataStore: boolean = false;
  public isSendingFeedback: boolean = false;
  public loading: boolean = false;
  private allDataSets: object[];
  private feedbackRecipients: any;
  private firstClick: boolean;
  public isFormValid: boolean = false;

  // our form model
  public datasetRequestForm: FormGroup;

  constructor(private _organisationUnitsService: OrganisationUnitsService,
    private _dataSetsService: DataSetsService,
    private _dataStoreService: DataStoreService,
    private _sharedDataService: SharedDataService,
    private _messageConversationService: MessageConversationService,
    private _toastService: ToastService,
    private _fb: FormBuilder) { }

  ngOnInit() {
    this.firstClick = true;
    this._dataSetsService.getAllDataSets().subscribe(response => {
      this.allDataSets = response.dataSets;
    });

    this._sharedDataService.getFeedbackReceipients().subscribe(response => {
      this.feedbackRecipients = response;
    })

    this.datasetRequestForm = this._fb.group({
      datasets: this._fb.array([
        this.initDatasetFilterForm(),
      ])
    });
  }

  initDatasetFilterForm() {
    return this._fb.group({
      selectedOrgUnitInfo: [''],
      addedOrgDataSets: [''],
      removedOrgDataSets: ['']
    });
  }


  addDatasetComponent(event) {
    event.stopPropagation();
    const control = <FormArray>this.datasetRequestForm.controls['datasets'];
    control.push(this.initDatasetFilterForm());
  }

  removeDatasetComponent(i: number, event) {
    event.stopPropagation();
    const control = <FormArray>this.datasetRequestForm.controls['datasets'];
    const isLastIndex = (control.controls.length - i) == 1;
    control.removeAt(i);
    // if the form is invalid and removed item is the last onChange
    // make the form valid again
    if (!this.isFormValid && isLastIndex) {
      this.isFormValid = true;
    }
  }


  componentDataUpdateEvent(componentIndex, event) {
    const formGroup = <FormArray>this.datasetRequestForm.controls['datasets'];

    formGroup.controls[componentIndex].patchValue({
      selectedOrgUnitInfo: event.selectedOrgUnitInfo,
      addedOrgDataSets: event.addedOrgDataSets,
      removedOrgDataSets: event.removedOrgDataSets
    });

    this.isFormValid = event.changeHappened;
  }



  formatDataStorePayload(addedOrgDataSets, removedOrgDataSets, selectedOrgUnit) {

    let dataSetOrgUnitAdded = [];
    let dataSetOrgUnitRemoved = [];
    let formNames = {
      added: [],
      removed: []
    };

    // Create payload array for added forms to the organisations
    if (addedOrgDataSets.length) {
      // Get full objects for all added dataset
      const addedOrgDataSetsIDs = _.map(addedOrgDataSets, 'id');
      dataSetOrgUnitAdded = _.filter(this.allDataSets, (dataSet) => {
        return _.includes(addedOrgDataSetsIDs, dataSet.id);
      });

      // Add organisationUnit to all dataset that have been added to the org unit.
      dataSetOrgUnitAdded = _.transform(dataSetOrgUnitAdded, (result, dataset) => {
        const datasetUrlTosendTo = `api/dataSets/${dataset.id}`;
        formNames.added.push(dataset.name);
        dataset.organisationUnits.push({ id: selectedOrgUnit.id })

        // name and periodType are requeired for any PUT payload created to the dataset
        result.push({
          url: datasetUrlTosendTo,
          method: 'PUT',
          status: 'OPEN',
          action: `Add ${dataset.name} form from ${selectedOrgUnit.name}.`,
          payload: _.pick(dataset, ['id', 'name', 'periodType', 'organisationUnits'])
        });

      }, [])
    }

    // Create payload array for removed forms to the organisations
    if (removedOrgDataSets.length) {
      // Get full objects for all removed dataset
      const removedOrgDataSetsIDs = _.map(removedOrgDataSets, 'id');

      dataSetOrgUnitRemoved = _.filter(this.allDataSets, (dataSet) => {

        return _.includes(removedOrgDataSetsIDs, dataSet.id);

      })
      // Remove organisationUnit to all dataset that have been removed to the org unit.
      dataSetOrgUnitRemoved = _.transform(dataSetOrgUnitRemoved, (result, dataset) => {
        const datasetUrlTosendTo = `api/dataSets/${dataset.id}`;
        formNames.removed.push(dataset.name);
        // Remove organisationUnit from dataSets.
        dataset.organisationUnits = _.filter(dataset.organisationUnits, (orgUnit) => {
          return orgUnit.id !== selectedOrgUnit.id;
        })
        // name and periodType are requeired for any PUT payload created to the dataset
        result.push({
          url: datasetUrlTosendTo,
          method: 'PUT',
          status: 'OPEN',
          action: `Remove ${dataset.name} form from ${selectedOrgUnit.name}.`,
          payload: _.pick(dataset, ['id', 'name', 'periodType', 'organisationUnits'])
        });

      }, [])
    }


    return {
      formNames: formNames,
      selectedOrgUnitName: selectedOrgUnit.name,
      payload: _.concat(dataSetOrgUnitAdded, dataSetOrgUnitRemoved)
    };

  }

  createDataStoreObjKey() {

    const formatter = new Intl.DateTimeFormat('fr', { month: 'short' }),
      month = formatter.format(new Date()),
      possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';

    for (let i = 0; i < 3; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return month.slice(0, -1).toUpperCase().concat('_', text);

  }

  sendFeedBackMessage(subject, message) {
    const payload = {
      subject: subject,
      text: message,
      userGroups: [{ id: this.feedbackRecipients.id }]
    }
    this._messageConversationService.sendFeedBackMessage(payload).subscribe(response => {
      // TODO: Send notification if possible about new message.
      // console.log(response);
      this.onDataStoreUpdate.emit({
        updated: true
      });
      this.isSendingFeedback = false;

    })

  }
  // TODO: (barnabas) find better way to prevent close on clicking add form buttons.
  clickOutside(event) {
    if (!this.firstClick && event) {
      this.onFiltersClosed.emit({
        closed: true
      });
    }
    this.firstClick = false;
  }


  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    // call API to save customer
    //console.log(value.datasets);
    const data = _.transform(value.datasets, (result, dataset) => {
      if (dataset.addedOrgDataSets.length || dataset.removedOrgDataSets.length) {
        const formatedDataStoreData = this.formatDataStorePayload(
          dataset.addedOrgDataSets, dataset.removedOrgDataSets, dataset.selectedOrgUnitInfo);
        result.push(formatedDataStoreData);
      }
    }, []);
    this.sendDataToDataStore(data);

  }

  sendDataToDataStore(data) {
    const dataStoreKey = this.createDataStoreObjKey();
    const dataStorePayload = [].concat.apply([], _.map(data, 'payload'));
    const feedbackSubject = `${dataStoreKey}:REQUEST FOR APROVAL CHANGE IN DATASET`;
    let text = `There is request to update datasets to `;
    for (let i = 0; i < data.length; i++) {
      data[i];
      const addedFormsNames = data[i].formNames.added ? data[i].formNames.added.join() : 'None';
      const removedFormsNames = data[i].formNames.removed ? data[i].formNames.removed.join() : 'None';

      text += `${data[i].selectedOrgUnitName} orgnisation unit, ${addedFormsNames} were added and ${removedFormsNames} were removed. `;

    }
    this.isSendingDataToDataStore = true;
    this._dataStoreService
      .createNewKeyAndValue(dataStoreKey, dataStorePayload)
      .subscribe(response => {
        if (response.ok) {
          this.isSendingDataToDataStore = false;
          this.isSendingFeedback = true;
          this._toastService.success('Your changes were sent for approval, Thanks.')
          this.sendFeedBackMessage(feedbackSubject, text);

        } else {
          this._toastService.error('There was an error when sending data.')
          this.isSendingDataToDataStore = false;
          this.onDataStoreUpdate.emit({
            updated: false
          });
        }
      });
  }

}
