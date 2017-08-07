import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//services
import {SharedDataService} from './shared-data.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    SharedDataService
  ],
  declarations: []
})
export class SharedModule { }
