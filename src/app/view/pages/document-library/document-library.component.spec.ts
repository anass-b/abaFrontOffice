import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLibraryComponent } from './document-library.component';

describe('DocumentLibraryComponent', () => {
  let component: DocumentLibraryComponent;
  let fixture: ComponentFixture<DocumentLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
