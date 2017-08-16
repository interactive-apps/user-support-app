import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//services
import { UserService } from './user.service';
import { TabsWorkflowService } from './tabs-workflow.service';
import { MessageConversationService } from './message-conversation.service'

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    UserService,
    TabsWorkflowService,
    MessageConversationService
  ],
  declarations: []
})
export class ServicesModule { }
