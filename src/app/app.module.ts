import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TreeModule } from 'angular-tree-component';
import { CommonModule, HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { UIRouterModule} from "@uirouter/angular";
import { Routes, RouterModule, PreloadAllModules} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';


import { AppComponent } from './app.component';
import {StoreModule} from "@ngrx/store";
import {INITIAL_APPLICATION_STATE} from './store/application-state';
import {uiStateReducer} from './store/reducers/ui-store-reducer';
import {storeDataReducer} from './store/reducers/store-data-reducer';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';


//custom defined modules
import { SharedModule } from './shared/shared.module';
import { ServicesModule } from './services/services.module';
import { OrgUnitService } from './components/org-unit-filter/org-unit.service'
import { ComponentsModule } from './components/components.module';

import { UIRouterConfigFn }   from "./app.router";

import { appStates } from "./app.route-states";


//components
import { HomeComponent } from './home/home.component';
import { OrgUnitFilterComponent } from  './components/org-unit-filter/org-unit-filter.component';
import { MultiselectComponent } from './components/org-unit-filter/multiselect/multiselect.component';
import { ActionComponent } from './home/action/action.component';
import { OrgUnitsComponent } from './home/org-units/org-units.component';
import { DataSetsComponent } from './home/data-sets/data-sets.component';
import { ResultsComponent } from './home/results/results.component';
import { MessagesComponent } from './home/messages/messages.component';
import { ComposeMessageComponent } from './home/messages/compose-message/compose-message.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MultiselectComponent,
    OrgUnitFilterComponent,
    ActionComponent,
    OrgUnitsComponent,
    DataSetsComponent,
    ResultsComponent,
    MessagesComponent,
    ComposeMessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule,
    ServicesModule,
    ReactiveFormsModule,
    BootstrapModalModule,
    TreeModule,
    StoreModule.provideStore({uiState: uiStateReducer,storeData: storeDataReducer},INITIAL_APPLICATION_STATE),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    UIRouterModule.forRoot({
      states: appStates,
      useHash: true,
      config: UIRouterConfigFn
    })
  ],
  providers: [
    {provide: 'rootApi', useValue: '../../../api/'},
    {provide: 'rootDir', useValue: '../../../'}, OrgUnitService],
  exports: [OrgUnitFilterComponent],
  entryComponents: [ComposeMessageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
