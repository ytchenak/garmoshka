import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeteorInputComponent } from './meteor-input.component';

describe('MeteorInputComponent', () => {
  let component: MeteorInputComponent;
  let fixture: ComponentFixture<MeteorInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeteorInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeteorInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
