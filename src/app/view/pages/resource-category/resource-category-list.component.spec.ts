import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceCategoryListComponent } from './resource-category-list.component';

describe('ResourceCategoryListComponent', () => {
  let component: ResourceCategoryListComponent;
  let fixture: ComponentFixture<ResourceCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceCategoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
