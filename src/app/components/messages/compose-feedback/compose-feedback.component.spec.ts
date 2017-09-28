import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeFeedbackComponent } from './compose-feedback.component';

describe('ComposeFeedbackComponent', () => {
  let component: ComposeFeedbackComponent;
  let fixture: ComponentFixture<ComposeFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComposeFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposeFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
