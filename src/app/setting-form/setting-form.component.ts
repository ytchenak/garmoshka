import { Component, OnInit } from '@angular/core';
import { MeteorService } from '../meteor.service';
import {LocalStorage} from 'ngx-webstorage';

@Component({
  selector: 'app-setting-form',
  templateUrl: './setting-form.component.html',
  styleUrls: ['./setting-form.component.scss']
})
export class SettingFormComponent implements OnInit {

  @LocalStorage() shower: string;
  @LocalStorage() showers: string;
  @LocalStorage() curDate: string;
  @LocalStorage() F: string;
  @LocalStorage() Lm: string;
  @LocalStorage() Dec: string;
  @LocalStorage() RaStartTime: string;
  @LocalStorage() RaStartValue: string;

  constructor(private meteorService: MeteorService) {
  }

  ngOnInit() {
    if( !this.shower)
      this.shower = 'PER';
    if( !this.showers)
      this.showers = '';
    if( !this.curDate)
      this.curDate = '11/08/2018';
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

  onSave() {
    this.meteorService.shower = this.shower;
    this.meteorService.showers = this.showers.split(',');
    let parts = this.curDate.split('/');
    this.meteorService.curDate = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
    this.meteorService.F = parseFloat(this.F);
    this.meteorService.Lm = parseFloat(this.Lm);
    this.meteorService.Dec = parseFloat(this.Dec);
    this.meteorService.RaStartTime = this.getTime_(this.RaStartTime);
    this.meteorService.RaStartValue = parseFloat(this.RaStartValue);
  }
  getTime_(timeValue: string): Date {
    var hours = timeValue.slice(0,2);
    var minutes = timeValue.slice(2,4);
    var time = new Date( this.meteorService.curDate.getFullYear(), this.meteorService.curDate.getMonth(), this.meteorService.curDate.getDate(), parseInt(hours), parseInt(minutes));
    return time;
  }
    

  
}
