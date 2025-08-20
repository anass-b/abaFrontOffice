import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaselineContentCardsComponent } from './baseline-content-cards.component';

describe('BaselineContentCardsComponent', () => {
  let component: BaselineContentCardsComponent;
  let fixture: ComponentFixture<BaselineContentCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaselineContentCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaselineContentCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
