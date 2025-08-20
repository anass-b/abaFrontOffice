import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResourceCategoryComponent } from './add-resource-category.component';

describe('AddResourceCategoryComponent', () => {
  let component: AddResourceCategoryComponent;
  let fixture: ComponentFixture<AddResourceCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddResourceCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddResourceCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
