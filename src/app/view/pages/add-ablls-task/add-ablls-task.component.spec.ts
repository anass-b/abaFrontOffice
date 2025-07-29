import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAbllsTaskComponent } from './add-ablls-task.component';

describe('AddAbllsTaskComponent', () => {
  let component: AddAbllsTaskComponent;
  let fixture: ComponentFixture<AddAbllsTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAbllsTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAbllsTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
