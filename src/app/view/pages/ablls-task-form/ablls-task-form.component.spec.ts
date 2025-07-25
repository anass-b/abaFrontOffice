import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbllsTaskFormComponent } from './ablls-task-form.component';

describe('AbllsTaskFormComponent', () => {
  let component: AbllsTaskFormComponent;
  let fixture: ComponentFixture<AbllsTaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbllsTaskFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbllsTaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
