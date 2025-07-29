import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialPhotoComponent } from './add-material-photo.component';

describe('AddMaterialPhotoComponent', () => {
  let component: AddMaterialPhotoComponent;
  let fixture: ComponentFixture<AddMaterialPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMaterialPhotoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMaterialPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
