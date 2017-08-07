import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//services
import { UserService } from './user.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    UserService
  ],
  declarations: []
})
export class ServicesModule { }
