import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrudeComponent } from './extrude.component';

describe('ExtrudeComponent', () => {
  let component: ExtrudeComponent;
  let fixture: ComponentFixture<ExtrudeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtrudeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
