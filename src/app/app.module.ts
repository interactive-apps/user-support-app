import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserXhr, HttpModule } from '@angular/http';
import { TreeModule } from 'angular-tree-component';
import { CommonModule, HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { NgProgressModule, NgProgressBrowserXhr } from 'ngx-progressbar';
import { AvatarModule } from 'ngx-avatar';


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
import { MenuModule } from './components/menu/menu.module';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';


import { OrgUnitFilterComponent } from  './components/org-unit-filter/org-unit-filter.component';
import { ListDatasetsComponent } from './components/list-datasets/list-datasets.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ComposeMessageComponent } from './components/messages/compose-message/compose-message.component';
import { CreateUsersComponent } from './components/create-users/create-users.component';
import { AddFormComponent } from './components/add-form/add-form.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ComposeFeedbackComponent } from './components/messages/compose-feedback/compose-feedback.component';

@NgModule({
  declarations: [
    AppComponent,
    OrgUnitFilterComponent,
    MessagesComponent,
    ComposeMessageComponent,
    CreateUsersComponent,
    AddFormComponent,
    ResetPasswordComponent,
    ListDatasetsComponent,
    ComposeFeedbackComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    NgProgressModule,
    AvatarModule,
    FormsModule,
    HttpModule,
    SharedModule,
    ServicesModule,
    ReactiveFormsModule,
    BootstrapModalModule,
    NgxPaginationModule,
    MultiselectDropdownModule,
    TreeModule,
    MenuModule,
    StoreModule.provideStore({uiState: uiStateReducer,storeData: storeDataReducer},INITIAL_APPLICATION_STATE),
    StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  providers: [
    { provide: BrowserXhr, useClass: NgProgressBrowserXhr },
    {provide: 'rootApi', useValue: '../../../api/'},
    {provide: 'rootDir', useValue: '../../../'}, OrgUnitService],
  exports: [OrgUnitFilterComponent],
  entryComponents: [ComposeMessageComponent,ComposeFeedbackComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
