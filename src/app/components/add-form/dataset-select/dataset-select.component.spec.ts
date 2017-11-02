import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetSelectComponent } from './dataset-select.component';

describe('DatasetSelectComponent', () => {
  let component: DatasetSelectComponent;
  let fixture: ComponentFixture<DatasetSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
