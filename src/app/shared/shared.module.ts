import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//services
import { SharedDataService } from './shared-data.service';
import { LimitToPipe } from './limit-to.pipe';
import { FilterLevelPipe } from './filter-level.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    SharedDataService
  ],
  declarations: [LimitToPipe, FilterLevelPipe],
  exports: [LimitToPipe, FilterLevelPipe]
})
export class SharedModule { }
