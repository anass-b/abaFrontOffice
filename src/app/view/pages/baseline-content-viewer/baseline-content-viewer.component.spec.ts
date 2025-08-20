import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaselineContentViewerComponent } from './baseline-content-viewer.component';

describe('BaselineContentViewerComponent', () => {
  let component: BaselineContentViewerComponent;
  let fixture: ComponentFixture<BaselineContentViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaselineContentViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaselineContentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
