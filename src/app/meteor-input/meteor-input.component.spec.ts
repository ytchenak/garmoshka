import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MeteorInputComponent } from './meteor-input.component';

describe('MeteorInputComponent', () => {
  let component: MeteorInputComponent;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MeteorInputComponent, RouterModule.forRoot([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(MeteorInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty input text', () => {
    expect(component.inputText).toBe('');
  });

  it('should return data values as array', () => {
    component.inputText = '2100\n3\n2200';
    expect(component.dataValues).toEqual(['2100', '3', '2200']);
  });

  it('should store data on input change', () => {
    component.inputText = '2100\n3\n2200';
    component.onInputChange();
    const stored = JSON.parse(localStorage.getItem('rowdata') || '[]');
    expect(stored.length).toBe(3);
    expect(stored[0].data).toBe('2100');
  });

  it('should clear data on clean', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.inputText = '2100\n3\n2200';
    component.onClean();
    expect(component.inputText).toBe('');
  });

  it('should not clear data if confirm is canceled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    component.inputText = '2100\n3\n2200';
    component.onClean();
    expect(component.inputText).toBe('2100\n3\n2200');
  });

  it('should handle calculation errors gracefully', () => {
    component.inputText = '2100\nINVALID\n2200';
    component.calc();
    expect(component.error).toContain('Unknown value');
  });

  it('should initialize line numbers to [1]', () => {
    expect(component.lineNumbers).toEqual([1]);
  });

  it('should update line numbers on input change', () => {
    component.inputText = '2100\n3\n2200';
    component.onInputChange();
    expect(component.lineNumbers).toEqual([1, 2, 3]);
  });

  it('should extract error row number from error message', () => {
    component.inputText = '2100\nINVALID\n2200';
    component.calc();
    expect(component.errorRow).toBe(2);
  });

  it('should set errorRow to 0 on successful calc', () => {
    component.inputText = '2100\n3\n2200';
    component.calc();
    expect(component.errorRow).toBe(0);
  });

  it('should reset line numbers on clean', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.inputText = '2100\n3\n2200';
    component.updateLineNumbers();
    expect(component.lineNumbers.length).toBe(3);
    component.onClean();
    expect(component.lineNumbers).toEqual([1]);
  });
});
