import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationCriteriaDetailsComponent } from './evaluation-criteria-details.component';

describe('EvaluationCriteriaDetailsComponent', () => {
  let component: EvaluationCriteriaDetailsComponent;
  let fixture: ComponentFixture<EvaluationCriteriaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationCriteriaDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationCriteriaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
