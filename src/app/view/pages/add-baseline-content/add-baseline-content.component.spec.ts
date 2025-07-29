import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBaselineContentComponent } from './add-baseline-content.component';

describe('AddBaselineContentComponent', () => {
  let component: AddBaselineContentComponent;
  let fixture: ComponentFixture<AddBaselineContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBaselineContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBaselineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
