import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//services
import { SharedDataService } from './shared-data.service';
import { FormDataService } from './form-data.service';
import { LimitToPipe } from './limit-to.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    SharedDataService,
    FormDataService
  ],
  declarations: [LimitToPipe],
  exports: [LimitToPipe]
})
export class SharedModule { }
