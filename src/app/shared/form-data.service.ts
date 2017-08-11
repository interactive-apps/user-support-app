import { Injectable } from '@angular/core';
import { FormData } from './../models/form-data.model';
import { User } from './../models/user.model';
import { Message } from './../models/message.model';
import { DataSet } from './../models/dataset-forms.model';
import { ActionType } from './../models/action-type.model'

import { STEPS } from './../models/tabsworkflow.model';
import { TabsWorkflowService } from './../services/tabs-workflow.service';

@Injectable()
export class FormDataService {

    public formData: FormData = new FormData();
    public isActionTypeFormValid: boolean = false;
    public isDataSetFormValid: boolean = false;
    public isOrgUnitsFormValid: boolean = false;

    constructor(private tabsWorkflowService: TabsWorkflowService) {
    }

    getActionType(): ActionType {
        // Return the Personal data
        var actionType: ActionType = {
            actionType: this.formData.actionType
        };
        return actionType;
    }

    setActionType(data: ActionType) {
        // Update the Personal data only when the Personal Form had been validated successfully
        this.isActionTypeFormValid = true;
        this.formData.actionType = data.actionType;
        // Validate Personal Step in Workflow
        this.tabsWorkflowService.validateStep(STEPS.action);
    }

    getDataSetForms() : DataSet {
        // Return the work type
        return this.formData.dataSet;
    }

    setDataSetsform(data: DataSet) {
        // Update the work type only when the Work Form had been validated successfully
        this.isDataSetFormValid = true;
        this.formData.dataSet = data;
        // Validate Work Step in Workflow
        this.tabsWorkflowService.validateStep(STEPS.datasets);
    }
    //
    // getAddress() : Address {
    //     // Return the Address data
    //     var address: Address = {
    //         street: this.formData.street,
    //         city: this.formData.city,
    //         state: this.formData.state,
    //         zip: this.formData.zip
    //     };
    //     return address;
    // }
    //
    // setAddress(data: Address) {
    //     // Update the Address data only when the Address Form had been validated successfully
    //     this.isAddressFormValid = true;
    //     this.formData.street = data.street;
    //     this.formData.city = data.city;
    //     this.formData.state = data.state;
    //     this.formData.zip = data.zip;
    //     // Validate Address Step in Workflow
    //     this.workflowService.validateStep(STEPS.address);
    // }
    //
    getFormData(): FormData {
        // Return the entire Form Data
        return this.formData;
    }
    //
    // resetFormData(): FormData {
    //     // Reset the workflow
    //     this.workflowService.resetSteps();
    //     // Return the form data after all this.* members had been reset
    //     this.formData.clear();
    //     this.isPersonalFormValid = this.isWorkFormValid = this.isAddressFormValid = false;
    //     return this.formData;
    // }

    isFormValid() {
        // Return true if all forms had been validated successfully; otherwise, return false
        return this.isActionTypeFormValid &&
                this.isDataSetFormValid &&
                this.isOrgUnitsFormValid;
    }
}
