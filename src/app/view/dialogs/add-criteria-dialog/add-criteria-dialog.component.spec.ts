import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCriteriaDialogComponent } from './add-criteria-dialog.component';

describe('AddCriteriaDialogComponent', () => {
  let component: AddCriteriaDialogComponent;
  let fixture: ComponentFixture<AddCriteriaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCriteriaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCriteriaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
