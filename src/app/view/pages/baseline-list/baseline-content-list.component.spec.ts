import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaselineContentListComponent } from './baseline-content-list.component';

describe('BaselineContentListComponent', () => {
  let component: BaselineContentListComponent;
  let fixture: ComponentFixture<BaselineContentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaselineContentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaselineContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
