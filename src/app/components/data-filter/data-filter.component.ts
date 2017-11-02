import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import * as fromDataFilterModel from './data-filter.model';
import { DataFilterService } from './services/data-filter.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrls: ['./data-filter.component.css']
})
export class DataFilterComponent implements OnInit, OnDestroy {

  listItems: any[] = [];
  dataGroups: any[] = [];
  selectedGroup: any = { id: 'dataSet_forms', name: "Dataset Form" };

  @Output() onDataUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDataFilterClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedItems: any[] = [];
  @Input() functionMappings: any[] = [];
  @Input() hiddenDataElements: any[] = [];
  @Input() allowSelection: boolean = true;
  @Input() autoUpdate: boolean = false;
  public initialDataSelection: any;
  public disableUpdate: boolean = true;
  public querystring: string = null;
  public listchanges: string = null;
  public showBody: boolean = false;
  private addedOrgDataSets: any = [];
  private removedOrgDataSets: any = [];
  private changeHappened: boolean = false;
  private subscription: Subscription;
  public metaData: any = {
    dataElements: [],
    indicators: [],
    dataElementGroups: [],
    indicatorGroups: [],
    categoryOptions: [],
    dataSets: [],
    programs: [],
    programIndicators: [],
    dataSetGroups: [
      { id: '', name: "" },
      { id: 'dataSet_forms', name: "Dataset Form" },
      { id: '.REPORTING_RATE_ON_TIME', name: "Reporting Rate on time" },
      { id: '.ACTUAL_REPORTS', name: "Actual Reports Submitted" },
      { id: '.ACTUAL_REPORTS_ON_TIME', name: "Reports Submitted on time" },
      { id: '.EXPECTED_REPORTS', name: "Expected Reports" }
    ]
  };
  public loading: boolean = true;
  p: number = 1;
  k: number = 1;
  need_groups: boolean = true;

  dataFilterOptions: any[];
  showGroups: boolean;
  constructor(
    private dataFilterService: DataFilterService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.dataFilterOptions = fromDataFilterModel.DATA_FILTER_OPTIONS_SELECTED;
    this.showGroups = false;
  }

  ngOnInit() {
    this.initiateData();
    this.initialDataSelection = this.selectedItems;
    this.dataUpdate();
  }

  // trigger this to reset pagination pointer when search change
  searchChanged() {
    this.p = 1;
  }

  initiateData() {
    this.subscription = this.dataFilterService.initiateData().subscribe(
      (items) => {
        this.metaData = Object.assign({}, {
          dataElements: items[0],
          indicators: items[1],
          dataElementGroups: items[3],
          indicatorGroups: items[2],
          categoryOptions: items[5],
          dataSets: items[4],
          programs: items[6],
          programIndicators: items[7],
          dataSetGroups: [
            { id: '', name: "Reporting Rate" },
            { id: 'dataSet_forms', name: "Dataset Form" },
            { id: '.REPORTING_RATE_ON_TIME', name: "Reporting Rate on time" },
            { id: '.ACTUAL_REPORTS', name: "Actual Reports Submitted" },
            { id: '.ACTUAL_REPORTS_ON_TIME', name: "Reports Submitted on time" },
            { id: '.EXPECTED_REPORTS', name: "Expected Reports" }
          ]
        });
        this.loading = false;
        this.dataGroups = this.groupList();
        this.listItems = this.dataItemList();

        /**
         * Detect changes manually
         */
        this.changeDetector.detectChanges();
      }
    )
  }

  setSelectedGroup(group, listArea, event) {
    event.stopPropagation();
    this.listchanges = '';
    this.selectedGroup = group;
    this.listItems = this.dataItemList();
    this.showGroups = false;
    this.p = 1;
    listArea.scrollTop = 0;
  }

  getSelectedOption(): any[] {
    let someArr = [];
    this.dataFilterOptions.forEach((val) => {
      if (val.selected) {
        someArr.push(val);
      }
    });
    return _.map(someArr, 'prefix')
  }

  // get data Items data_element, indicators, dataSets
  getDataItems() {
    let dataElements = [];
    this.metaData.dataElements.forEach((dataelement) => {
      dataElements.push(...this.getDetailedDataElements(dataelement))
    });
    return {
      de: dataElements,
      in: this.metaData.indicators,
      ds: this.metaData.dataSets,
      pi: this.metaData.programIndicators
    }
  }

  // this function helps you to get the detailed metadata
  getDetailedDataElements(dataElement) {
    let dataElements = [];
    let categoryCombo = this.getCategoryCombo(dataElement.categoryCombo.id);

    dataElements.push({
      dataElementId: dataElement.id,
      id: dataElement.id,
      name: dataElement.name + "",
      dataSetElements: dataElement.dataSetElements
    });

    categoryCombo.categoryOptionCombos.forEach((option) => {
      if (option.name != 'default') {
        dataElements.push({
          dataElementId: dataElement.id,
          id: dataElement.id + "." + option.id,
          name: dataElement.name + " " + option.name,
          dataSetElements: dataElement.dataSetElements
        })
      }

    });

    return dataElements;
  }

  // Helper to get the data elements option
  getCategoryCombo(uid): any {
    let category = null;
    this.metaData.categoryOptions.forEach((val) => {
      if (val.id == uid) {
        category = val;
      }
    });
    return category;

  }

  // Helper function to get data groups
  getData() {
    return {
      dx: this.metaData.dataElementGroups,
      in: this.metaData.indicatorGroups,
      ds: this.metaData.dataSetGroups,
      pr: this.metaData.programs
    }
  }

  // get the data list do display
  dataItemList() {
    let currentList = [];
    const group = this.selectedGroup;
    const selectedOptions = this.getSelectedOption();
    const data = this.getDataItems();
    // check if data element is in a selected group
    if (_.includes(selectedOptions, 'ALL') || _.includes(selectedOptions, 'de')) {
      if (group.id == 'ALL') {
        currentList.push(...data.de)
      } else {
        if (group.hasOwnProperty('dataElements')) {
          let newArray = _.filter(data.de, (dataElement) => {
            return _.includes(_.map(group.dataElements, 'id'), dataElement.dataElementId);
          });
          currentList.push(...newArray);
        }

      }

    }
    // check if data indicators are in a selected group
    if (_.includes(selectedOptions, 'ALL') || _.includes(selectedOptions, 'in')) {
      if (group.id == 'ALL') {
        currentList.push(...data.in)
      } else {
        if (group.hasOwnProperty('indicators')) {
          let newArray = _.filter(data.in, (indicator) => {
            return _.includes(_.map(group.indicators, 'id'), indicator['id']);
          });
          currentList.push(...newArray)
        }
      }
    }

    // check if data data sets are in a selected group
    if (_.includes(selectedOptions, 'ALL') || _.includes(selectedOptions, 'ds')) {
      if (group.id == 'ALL') {
        this.metaData.dataSetGroups.forEach((group) => {
          currentList.push(...data.ds.map(datacv => {
            return { id: datacv.id + group.id, name: group.name + ' ' + datacv.name }
          }))
        });
      } else if (!group.hasOwnProperty('indicators') && !group.hasOwnProperty('dataElements')) {
        currentList.push(...data.ds.map(datacv => {

          if(group.id === 'dataSet_forms'){
            return { id: datacv.id, name: datacv.name, periodType: datacv.periodType }
          }else {
            return { id: datacv.id + group.id, name: group.name + ' ' + datacv.name }
          }
        }));
      }
    }
    // check if program
    if (_.includes(selectedOptions, 'ALL') || _.includes(selectedOptions, 'pr')) {
      if (group.id == 'ALL') {
        currentList.push(...data.pi);
      } else {
        if (group.hasOwnProperty('programIndicators')) {
          let newArray = _.filter(data.pi, (indicator) => {
            return _.includes(_.map(group.programIndicators, 'id'), indicator['id']);
          });
          currentList.push(...newArray)
        }
      }
    }

    const currentListWithOutHiddenItems = _.filter(currentList, (item => {
      return !_.includes(this.hiddenDataElements, item['id']);
    }));

    return _.sortBy(_.filter(currentListWithOutHiddenItems, (item: any) => !_.find(this.selectedItems, ['id', item.id])), ['name']);

  }

  // Get group list to display
  groupList() {
    this.need_groups = true;
    let currentGroupList = [];
    const options = this.getSelectedOption();
    const data = this.getData();

    // currentGroupList.push(...[{id:'ALL',name:'All Tables'}]);
    if (_.includes(options, 'ALL') || _.includes(options, 'de')) {

      currentGroupList.push(...data.dx)
    }

    if (_.includes(options, 'ALL') || _.includes(options, 'in')) {
      if (options.length == 1 && _.includes(options, 'in')) {
        currentGroupList.push(...data.in)
      } else {
        currentGroupList.push(...data.in.map(indicatorGroup => {
          return { id: indicatorGroup.id, name: indicatorGroup.name + ' - Computed', indicators: indicatorGroup.indicators, }
        }));
      }
    }

    if (_.includes(options, 'ALL') || _.includes(options, 'pr')) {
      currentGroupList.push(...data.pr)
    }

    if (_.includes(options, 'ALL') || _.includes(options, 'ds')) {
      currentGroupList.push(...data.ds)
    }

    if (_.includes(options, 'ds')) {
      this.need_groups = false;
    }

    return _.sortBy(currentGroupList, ['name']);
  }

  // this will add a selected item in a list function
  addSelected(item, event) {
    event.stopPropagation();
    const itemIndex = _.findIndex(this.listItems, item);

    this.listItems = [
      ...this.listItems.slice(0, itemIndex),
      ...this.listItems.slice(itemIndex + 1)
    ];

    if (!_.find(this.selectedItems, ['id', item.id])) {
      this.selectedItems = [
        ...this.selectedItems,
        item
      ];
    }
    this.disableRequestIfNoChange(event);
  }

  // Remove selected Item
  removeSelected(item, event) {
    event.stopPropagation();
    const itemIndex = _.findIndex(this.selectedItems, item);

    this.selectedItems = [
      ...this.selectedItems.slice(0, itemIndex),
      ...this.selectedItems.slice(itemIndex + 1)
    ];

    if (!_.find(this.listItems, ['id', item.id])) {
      this.listItems = [
        ...this.listItems,
        item
      ];
    }
    this.disableRequestIfNoChange(event);
  }

  getAutogrowingTables(selections) {
    let autogrowings = [];
    selections.forEach((value) => {
      if (value.hasOwnProperty('programType')) {
        autogrowings.push(value);
      }
    });
    return autogrowings;
  }

  getFunctions(selections) {
    let mappings = [];
    selections.forEach((value) => {
      let dataElementId = value.id.split(".");
      this.functionMappings.forEach(mappedItem => {
        let mappedId = mappedItem.split("_");
        if (dataElementId[0] == mappedId[0]) {
          mappings.push({ id: value.id, func: mappedId[1] })
        }
      });
    });
    return mappings;
  }

  //selecting all items
  selectAllItems(event) {
    event.stopPropagation();

    this.listItems.forEach((item) => {
      if (!_.find(this.selectedItems, ['id', item.id])) {
        this.selectedItems = [
          ...this.selectedItems,
          item
        ];
      }
    });

    this.listItems = [];
  }

  //selecting all items
  deselectAllItems(e) {
    e.stopPropagation();
    this.selectedItems.forEach((item) => {
      if (!_.find(this.listItems, ['id', item.id])) {
        this.listItems = [
          ...this.listItems,
          item
        ];
      }
    });

    this.selectedItems = [];
  }

  // Check if item is in selected list
  inSelected(item, list) {
    let checker = false;
    for (let per of list) {
      if (per.id == item.id) {
        checker = true;
      }
    }
    return checker;
  }

  // action that will fire when the sorting of selected data is done
  transferDataSuccess(data, current) {
    if (data.dragData.id == current.id) {
      console.log("Droping in the same area")
    } else {
      let number = (this.getDataPosition(data.dragData.id) > this.getDataPosition(current.id)) ? 0 : 1;
      this.deleteData(data.dragData);
      this.insertData(data.dragData, current, number);
    }
  }

  emit(e) {
    e.stopPropagation();
    this.dataUpdate();
  }

  dataUpdate(){
    this.onDataUpdate.emit({
      addedOrgDataSets: this.addedOrgDataSets,
      removedOrgDataSets: this.removedOrgDataSets,
      changeHappened: this.changeHappened,
      itemList: this.selectedItems,
      need_functions: this.getFunctions(this.selectedItems),
      auto_growing: this.getAutogrowingTables(this.selectedItems),
      selectedData: { name: 'dx', value: this.getDataForAnalytics(this.selectedItems) },
      hideQuarter: this.hideQuarter,
      hideMonth: this.hideMonth
    });
  }

  // helper method to find the index of dragged item
  getDataPosition(Data_id) {
    let Data_index = null;
    this.selectedItems.forEach((Data, index) => {
      if (Data.id == Data_id) {
        Data_index = index;
      }
    });
    return Data_index;
  }

  // help method to delete the selected Data in list before inserting it in another position
  deleteData(Data_to_delete) {
    this.selectedItems.forEach((Data, Data_index) => {
      if (Data_to_delete.id == Data.id) {
        this.selectedItems.splice(Data_index, 1);
      }
    });
  }

  // Helper method to insert Data in new position after drag drop event
  insertData(Data_to_insert, current_Data, num: number) {
    this.selectedItems.forEach((Data, Data_index) => {
      if (current_Data.id == Data.id && !this.checkDataAvailabilty(Data_to_insert, this.selectedItems)) {
        this.selectedItems.splice(Data_index + num, 0, Data_to_insert);
      }
    });
  }

  // check if orgunit already exist in the orgunit display list
  checkDataAvailabilty(Data, array): boolean {
    let checker = false;
    for (let per of array) {
      if (per.id == Data.id) {
        checker = true;
      }
    }
    return checker;
  }

  hideMonth: boolean = false;
  hideQuarter: boolean = false;

  getDataForAnalytics(selectedData) {
    let dataForAnalytics = "";
    let counter = 0;
    selectedData.forEach((dataValue) => {
      let dataElementId = dataValue.id.split(".");
      if (dataValue.hasOwnProperty('programType')) {
      } else {
        let mapped = false;
        this.functionMappings.forEach(mappedItem => {
          let mappedId = mappedItem.split("_");
          if (dataElementId[0] == mappedId[0]) {
            mapped = true;
          }
        });
        if (mapped) { } else {
          dataForAnalytics += counter == 0 ? dataValue.id : ';' + dataValue.id;
          counter++;
        }
      }
    });
    return dataForAnalytics;
  }

  close(e) {
    e.stopPropagation();
    this.onDataFilterClose.emit(true);
  }

  toggleDataFilterOption(toggledOption, event) {
    event.stopPropagation();
    const multipleSelection = event.ctrlKey ? true : false;

    this.dataFilterOptions = this.dataFilterOptions.map(option => {
      const newOption: any = { ...option };

      if (toggledOption.prefix === 'ALL') {
        if (newOption.prefix !== 'ALL') {
          newOption.selected = false;
        } else {
          newOption.selected = !toggledOption.selected;
        }
      } else {

        if (newOption.prefix === toggledOption.prefix) {
          newOption.selected = !newOption.selected;
        }

        if (toggledOption.prefix === 'ALL') {
          if (newOption.prefix !== 'ALL' && toggledOption.selected) {
            newOption.selected = false;
          }
        } else {
          if (newOption.prefix === 'ALL') {
            newOption.selected = false;
          }
        }

        if (!multipleSelection && toggledOption.prefix !== newOption.prefix) {
          newOption.selected = false;
        }
      }

      return newOption;
    });

    this.selectedGroup = { id: 'ALL', name: 'All' };
    this.dataGroups = this.groupList();

    this.listItems = this.dataItemList();
    this.p = 1;
    this.listchanges = '';
  }

  toggleDataFilterGroupList(e) {
    e.stopPropagation();
    this.showGroups = !this.showGroups;
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleShowBody(e) {
    e.stopPropagation();
    this.showBody = !this.showBody;
  }

  disableRequestIfNoChange(event){
    this.removedOrgDataSets =  _.difference(this.initialDataSelection, this.selectedItems);
    this.addedOrgDataSets = _.difference(this.selectedItems, this.initialDataSelection);
    if(this.removedOrgDataSets.length || this.addedOrgDataSets.length){
      this.disableUpdate = false;
      this.changeHappened = true;
    }else {
      this.disableUpdate = true;
    }
    this.emit(event);
  }



}
