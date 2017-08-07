import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TreeModule } from 'angular-tree-component';

import { AppComponent } from './app.component';
import {StoreModule} from "@ngrx/store";
import {INITIAL_APPLICATION_STATE} from './store/application-state';
import {uiStateReducer} from './store/reducers/ui-store-reducer';
import {storeDataReducer} from './store/reducers/store-data-reducer';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';


//custom defined modules
import { SharedModule } from './shared/shared.module';
import { ServicesModule } from './services/services.module';
import { ComponentsModule } from './components/components.module';

//components
import { HomeComponent } from './home/home.component';
import { OrgUnitFilterComponent } from  './components/org-unit-filter/org-unit-filter.component';
import { MultiselectComponent } from './components/org-unit-filter/multiselect/multiselect.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MultiselectComponent,
    OrgUnitFilterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule,
    ServicesModule,
    ComponentsModule,
    TreeModule,
    StoreModule.provideStore({uiState: uiStateReducer,storeData: storeDataReducer},INITIAL_APPLICATION_STATE),
    StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  providers: [
    {provide: 'rootApi', useValue: '../../../api/'},
    {provide: 'rootDir', useValue: '../../../'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
