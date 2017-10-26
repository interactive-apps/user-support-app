import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFilterComponent } from './data-filter.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { FormsModule } from '@angular/forms';
import { FilterByNamePipe } from './pipes/filter-by-name.pipe';
import { LimitByLengthPipe } from './pipes/limit-by-length.pipe'
import { OrderPipe } from './pipes/order-by.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddUnderscorePipe } from './pipes/add-underscore.pipe';
import { DragulaModule } from 'ng2-dragula';
import { DndModule } from 'ng2-dnd';
import { DataFilterService } from './services/data-filter.service';
import { LocalStorageService } from './services/local-storage.service';
import { AngularIndexedDB } from './services/angular2-indexeddb';
import { HttpModule } from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    DragulaModule,
    NgxPaginationModule,
    DndModule.forRoot()
  ],
  declarations: [
    DataFilterComponent,
    ClickOutsideDirective,
    FilterByNamePipe,
    LimitByLengthPipe,
    OrderPipe,
    AddUnderscorePipe,
  ],
  exports: [DataFilterComponent, FilterByNamePipe, LimitByLengthPipe],
  providers: [
    DataFilterService,
    LocalStorageService,
    AngularIndexedDB
  ]
})
export class DataFilterModule { }
