import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//services
import { UserService } from './user.service';
import { MessageService } from './message.service';
import { TabsWorkflowService } from './tabs-workflow.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    UserService,
    MessageService,
    TabsWorkflowService
  ],
  declarations: []
})
export class ServicesModule { }
