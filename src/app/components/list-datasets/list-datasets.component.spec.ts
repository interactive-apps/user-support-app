import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDatasetsComponent } from './list-datasets.component';

describe('ListDatasetsComponent', () => {
  let component: ListDatasetsComponent;
  let fixture: ComponentFixture<ListDatasetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDatasetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
