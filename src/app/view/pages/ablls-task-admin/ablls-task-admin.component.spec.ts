import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbllsTaskAdminComponent } from './ablls-task-admin.component';

describe('AbllsTaskAdminComponent', () => {
  let component: AbllsTaskAdminComponent;
  let fixture: ComponentFixture<AbllsTaskAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbllsTaskAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbllsTaskAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
