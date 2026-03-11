import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { RouterModule, Router } from '@angular/router';
import { SheetComponent } from './sheet.component';
import { StorageService } from '../storage.service';

describe('SheetComponent', () => {
  let component: SheetComponent;

  beforeEach(async () => {
    localStorage.clear();
    const storageService = new StorageService();
    storageService.setSetting('shower', 'PER');
    storageService.setSetting('showers', '');
    storageService.setSetting('curDate', '12/08/2024');
    storageService.setSetting('F', '0');
    storageService.setSetting('Lm', '5.75');
    storageService.setSetting('Dec', '30');
    storageService.setSetting('RaStartTime', '1900');
    storageService.setSetting('RaStartValue', '236');
    storageService.setRowData([{ data: '2100' }, { data: '3' }, { data: '2200' }]);

    await TestBed.configureTestingModule({
      imports: [SheetComponent, RouterModule.forRoot([{ path: 'count-distribution', component: SheetComponent }])],
    }).compileComponents();
  });

  it('should create', () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(SheetComponent);
    vi.spyOn(router, 'url', 'get').mockReturnValue('/count-distribution');
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load count distribution data', () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(SheetComponent);
    vi.spyOn(router, 'url', 'get').mockReturnValue('/count-distribution');
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.title).toBe('Count Distribution');
    expect(component.headers.length).toBeGreaterThan(0);
    expect(component.rows.length).toBeGreaterThan(0);
  });

  it('should load magnitude distribution data', () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(SheetComponent);
    vi.spyOn(router, 'url', 'get').mockReturnValue('/magnitude-distribution');
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.title).toBe('Magnitude Distribution');
    expect(component.headers.length).toBeGreaterThan(0);
  });
});
