import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//services
import { SharedDataService } from './shared-data.service';
import { LimitToPipe } from './limit-to.pipe';
import { FilterLevelPipe } from './filter-level.pipe';
import { FilterByKeyValuesPipe } from './filter-by-key-values.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    SharedDataService
  ],
  declarations: [LimitToPipe, FilterLevelPipe, FilterByKeyValuesPipe],
  exports: [LimitToPipe, FilterLevelPipe, FilterByKeyValuesPipe]
})
export class SharedModule { }
