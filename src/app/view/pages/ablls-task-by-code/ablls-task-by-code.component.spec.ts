import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbllsTaskByCodeComponent } from './ablls-task-by-code.component';

describe('AbllsTaskByCodeComponent', () => {
  let component: AbllsTaskByCodeComponent;
  let fixture: ComponentFixture<AbllsTaskByCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbllsTaskByCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbllsTaskByCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
