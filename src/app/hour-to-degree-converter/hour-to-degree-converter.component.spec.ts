import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HourToDegreeConverterComponent } from './hour-to-degree-converter.component';

describe('HourToDegreeConverterComponent', () => {
  let component: HourToDegreeConverterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HourToDegreeConverterComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HourToDegreeConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert time to degrees', () => {
    component.time = '120000';
    expect(component.degrees).toBe('180.00');
  });

  it('should convert degrees to time', () => {
    component.degrees = '180';
    expect(component.time).toBe('120000');
  });

  it('should convert 000000 to 0 degrees', () => {
    component.time = '000000';
    expect(component.degrees).toBe('0.00');
  });

  it('should handle invalid time input', () => {
    component.time = 'abc';
    expect(component.degrees).toBe('');
  });

  it('should handle invalid degrees input', () => {
    component.degrees = 'abc';
    expect(component.time).toBe('');
  });

  it('should not update if same value is set', () => {
    component.time = '120000';
    const currentDeg = component.degrees;
    component.time = '120000';
    expect(component.degrees).toBe(currentDeg);
  });
});
