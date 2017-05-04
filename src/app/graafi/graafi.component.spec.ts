import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraafiComponent } from './graafi.component';

describe('GraafiComponent', () => {
  let component: GraafiComponent;
  let fixture: ComponentFixture<GraafiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraafiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraafiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
