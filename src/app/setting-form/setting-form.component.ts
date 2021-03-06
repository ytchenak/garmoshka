import { Component, OnInit } from '@angular/core';
import {LocalStorage} from 'ngx-webstorage';
import * as moment from 'moment';

@Component({
  selector: 'app-setting-form',
  templateUrl: './setting-form.component.html',
  styleUrls: ['./setting-form.component.scss']
})
export class SettingFormComponent implements OnInit {

  @LocalStorage() name: string;
  @LocalStorage() shower: string;
  @LocalStorage() showers: string;
  @LocalStorage() curDate: string;
  @LocalStorage() F: string;
  @LocalStorage() Lm: string;
  @LocalStorage() Dec: string;
  @LocalStorage() RaStartTime: string;
  @LocalStorage() RaStartValue: string;

  constructor() {
    if( !this.name)
      this.name = '';
    if( !this.shower)
      this.shower = 'PER';
    if( !this.showers)
      this.showers = '';
    if( !this.curDate)
      this.curDate = moment(new Date()).format('DD/MM/YYYY');;
    if( !this.F )
      this.F = '0';
    if( !this.Lm)
      this.Lm = '5.75';
    if( !this.Dec) 
      this.Dec = '30';
    if( !this.RaStartTime )
      this.RaStartTime = '1900';
    if( !this.RaStartValue)
      this.RaStartValue = '236';
  }

  ngOnInit() {
  }

    

  
}
