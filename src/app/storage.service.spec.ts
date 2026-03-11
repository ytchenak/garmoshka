import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default value when key does not exist', () => {
    expect(service.getSettings('nonexistent', 'default')).toBe('default');
  });

  it('should store and retrieve settings', () => {
    service.setSettings('testKey', { a: 1 });
    const result = service.getSettings<Record<string, number> | null>('testKey', null);
    expect(result).toEqual({ a: 1 });
  });

  it('should store and retrieve a setting field', () => {
    service.setSetting('shower', 'PER');
    expect(service.getSetting('shower', '')).toBe('PER');
  });

  it('should store and retrieve row data', () => {
    const data = [{ data: '2100' }, { data: '3' }];
    service.setRowData(data);
    expect(service.getRowData()).toEqual(data);
  });

  it('should return null for row data when not set', () => {
    expect(service.getRowData()).toBeNull();
  });

  it('should handle corrupted localStorage gracefully', () => {
    localStorage.setItem('badKey', '{invalid json');
    expect(service.getSettings('badKey', 'fallback')).toBe('fallback');
  });
});
