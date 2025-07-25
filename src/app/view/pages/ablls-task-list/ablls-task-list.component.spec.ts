import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbllsTaskListComponent } from './ablls-task-list.component';

describe('AbllsTaskListComponent', () => {
  let component: AbllsTaskListComponent;
  let fixture: ComponentFixture<AbllsTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbllsTaskListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbllsTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
