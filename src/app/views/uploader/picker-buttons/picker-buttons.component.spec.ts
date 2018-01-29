import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickerButtonsComponent } from './picker-buttons.component';

describe('PickerButtonComponent', () => {
  let component: PickerButtonsComponent;
  let fixture: ComponentFixture<PickerButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickerButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickerButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
