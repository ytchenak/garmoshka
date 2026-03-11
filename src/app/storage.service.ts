import { Injectable } from '@angular/core';

const SETTINGS_KEY = 'garmoshka_settings';
const ROWDATA_KEY = 'rowdata';

@Injectable({ providedIn: 'root' })
export class StorageService {
  getSettings<T>(key: string, defaultValue: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        return JSON.parse(raw) as T;
      }
    } catch {
      // ignore parse errors
    }
    return defaultValue;
  }

  setSettings<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getSetting(field: string, defaultValue: string): string {
    return this.getSettings<string>(`${SETTINGS_KEY}_${field}`, defaultValue);
  }

  setSetting(field: string, value: string): void {
    this.setSettings(`${SETTINGS_KEY}_${field}`, value);
  }

  getRowData(): Array<{ data: string }> | null {
    return this.getSettings<Array<{ data: string }> | null>(ROWDATA_KEY, null);
  }

  setRowData(data: Array<{ data: string }>): void {
    this.setSettings(ROWDATA_KEY, data);
  }
}
