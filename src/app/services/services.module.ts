import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//services
import { UserService } from './user.service';
import { MessageConversationService } from './message-conversation.service';
import { OrganisationUnitsService } from './organisation-units.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    UserService,
    MessageConversationService,
    OrganisationUnitsService
  ],
  declarations: []
})
export class ServicesModule { }
