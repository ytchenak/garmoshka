import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../storage.service';
import { DEFAULT_SETTINGS } from '../meteor-settings';
import { HourToDegreeConverterComponent } from '../hour-to-degree-converter/hour-to-degree-converter.component';

@Component({
  selector: 'app-setting-form',
  imports: [FormsModule, HourToDegreeConverterComponent],
  templateUrl: './setting-form.component.html',
  styleUrl: './setting-form.component.scss',
})
export class SettingFormComponent {
  name: string;
  shower: string;
  showers: string;
  curDate: string;
  F: string;
  Lm: string;
  Dec: string;
  RaStartTime: string;
  RaStartValue: string;

  constructor(private storage: StorageService) {
    this.name = this.storage.getSetting('name', DEFAULT_SETTINGS.name);
    this.shower = this.storage.getSetting('shower', DEFAULT_SETTINGS.shower);
    this.showers = this.storage.getSetting('showers', DEFAULT_SETTINGS.showers);
    this.curDate = this.storage.getSetting('curDate', DEFAULT_SETTINGS.curDate);
    this.F = this.storage.getSetting('F', DEFAULT_SETTINGS.F);
    this.Lm = this.storage.getSetting('Lm', DEFAULT_SETTINGS.Lm);
    this.Dec = this.storage.getSetting('Dec', DEFAULT_SETTINGS.Dec);
    this.RaStartTime = this.storage.getSetting('RaStartTime', DEFAULT_SETTINGS.RaStartTime);
    this.RaStartValue = this.storage.getSetting('RaStartValue', DEFAULT_SETTINGS.RaStartValue);
  }

  onFieldChange(field: string, value: string): void {
    this.storage.setSetting(field, value);
  }
}
