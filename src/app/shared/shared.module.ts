import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//services
import { SharedDataService } from './shared-data.service';
import { FormDataService } from './form-data.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    SharedDataService,
    FormDataService
  ],
  declarations: []
})
export class SharedModule { }
