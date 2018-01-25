import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickerButtonComponent } from './picker-button.component';

describe('PickerButtonComponent', () => {
  let component: PickerButtonComponent;
  let fixture: ComponentFixture<PickerButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickerButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
