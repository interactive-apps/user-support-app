import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgUnitService } from './org-unit-filter/org-unit.service';
import { DatasetSelectComponent } from './add-form/dataset-select/dataset-select.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DatasetSelectComponent],
  exports: [DatasetSelectComponent],
  providers: [
    OrgUnitService
  ]
})
export class ComponentsModule { }
