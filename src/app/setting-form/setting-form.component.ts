import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting-form',
  templateUrl: './setting-form.component.html',
  styleUrls: ['./setting-form.component.scss']
})
export class SettingFormComponent implements OnInit {

  shower: string;
  showers: string;
  curDate: string;
  F: string;
  Lm: string;
  Dec: string;
  RaStartTime: string;
  RaStartValue: string;

  constructor() { }

  ngOnInit() {
  }

  onSave() {
    alert(JSON.stringify(this));
  }
}
