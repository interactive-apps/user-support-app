import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//services
import { UserService } from './user.service';
import { MessageConversationService } from './message-conversation.service'

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    UserService,
    MessageConversationService
  ],
  declarations: []
})
export class ServicesModule { }
