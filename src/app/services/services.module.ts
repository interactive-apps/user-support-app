import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//services
import { UserService } from './user.service';
import { MessageConversationService } from './message-conversation.service';
import { OrganisationUnitsService } from './organisation-units.service';
import { DataSetsService } from './data-sets.service';
import { DataStoreService } from './data-store.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    UserService,
    MessageConversationService,
    OrganisationUnitsService,
    DataSetsService,
    DataStoreService
  ],
  declarations: []
})
export class ServicesModule { }
