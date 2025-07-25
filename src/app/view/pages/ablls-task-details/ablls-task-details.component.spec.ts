import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbllsTaskDetailsComponent } from './ablls-task-details.component';

describe('AbllsTaskDetailsComponent', () => {
  let component: AbllsTaskDetailsComponent;
  let fixture: ComponentFixture<AbllsTaskDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbllsTaskDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbllsTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
