import { Injectable } from '@angular/core';
import { SettingFormComponent } from './setting-form/setting-form.component';

@Injectable({
  providedIn: 'root'
})
export class MeteorService {
  F: number;
  Lm: any;
  curDate: Date;
  shower: string;
  showers: string[];
  Dec: number;
  RaStartTime: any;
  RaDiffInMin: number = 0.25;
  RaStartValue: number;

  LmrRegex = /^[Ll][Mm]=([0-9]+\.?[0-9]*)$/;

  countDistribution: Array<Array<any>>;
  magnitudeDistribution: Array<Array<any>>;
  spoCount: number;
  showerCount: number;
  stat = {};

  constructor() { }

  calc(dataValues: Array<string>) {
    this.readSetting_()

    let period = 1; 
   
    let stat = {};
    this.initStat_(stat);
    this.initStat_(this.stat);
    let startTime = null;
    let endTime = null;
    
    let skip = false;
    
    this.cleanResults_(stat);
    this.spoCount = 0;
    this.showerCount = 0;   
    for( let i=0; i<dataValues.length; i++ ) {
      let dataValue = dataValues[i];
  
      if( dataValue === '' ) {
        continue;
      }
      else if( dataValue === '//' ) {        //skip current periosd
        if( !this.isTime_(dataValues[i-1]) )
          throw Error('Observation break without start time in input column row ' + (i+1));
        skip = true;
        
      } else if( /^\d+%$/.test(dataValue) ) {  //field of obstruction in percent 
        this.F = parseFloat(dataValue.slice(0, -1));
  
      } else if( this.isLm_(dataValue))  {  //Lm 
        this.Lm = this.getLm_(dataValue);
  
      } else if( this.isTime_(dataValue) ) { //if time, 
        if( !startTime ) { //first time
          startTime = this.getTime_(dataValue);
          this.initStat_(stat);
        } else {  //it is end of the current period and start of next period
          if( endTime ) {
            startTime = endTime;
          }
          endTime = this.getTime_(dataValue);
          if( startTime > endTime ) {
            this.curDate = this.incDays_(this.curDate);
            endTime = this.getTime_(dataValue);
          }
  
          if( skip ) {
            skip = false;
            continue; //skip result
          }
          
          //write result;
          this.addCountDistribution_(period, startTime, endTime, stat);
          this.addMagninudeDistribution_(period, startTime, endTime, stat);
          this.initStat_(stat);
          period++;
        }
      } else { //magnitude     
        if( this.isSporadic_(dataValue)) {
          var mag = dataValue.slice(0, -1);
          this.addMeteorToStat_(stat, 'SPO', mag);
          this.spoCount += 1 
        } else if( this.isDefaultShower_(dataValue)) {  //default shower
          var mag = dataValue;
          this.addMeteorToStat_(stat, this.shower, mag); 
          this.showerCount += 1;
        } else if(this.isMinorShower_(dataValue)) {     //minior shower
          var name = dataValue.slice(-3);
          var mag = dataValue.slice(0,-3);
          this.addMeteorToStat_(stat, name, mag);        
        
        } else { //unknow value -- show error
          throw new Error( "Unkknow value " + dataValue + " in Input column row " + (i+1) );
        }
      }
      //next
    }
  }
  readSetting_() {
    let setting = new SettingFormComponent();
    this.shower = setting.shower;
    this.showers = setting.showers.split(',');
    let parts = setting.curDate.split('/');
    this.curDate = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
    this.F = parseFloat(setting.F);
    this.Lm = parseFloat(setting.Lm);
    this.Dec = parseFloat(setting.Dec);
    this.RaStartTime = this.getTime_(setting.RaStartTime);
    this.RaStartValue = parseFloat(setting.RaStartValue);
  }

  isMinorShower_(dataValue: string): any {
    var regex = /^-?\d[A-Z]{3}$/;
    if( regex.test(dataValue) ) {
      var name = dataValue.slice(-3);
      return this.showers.indexOf(name) >= 0;
    }
    return false;
  }
  isDefaultShower_(dataValue: string): any {
    var regex = /^-?\d$/;
    return regex.test(dataValue); 
  }
  isLm_(dataValue: string): boolean {
    return this.LmrRegex.test(dataValue);
  }
  getLm_(dataValue: string): number {
    return parseFloat(dataValue.match(this.LmrRegex)[1]);
  }
  initStat_(stat: {}): any {
    stat[this.shower] = {};
    for( var m= 0; m<this.showers.length; m++) {
      stat[this.showers[m]] = {};
    }
    stat['SPO'] = {};
  
    for( var i= -6; i<=7; i++) {
      stat[this.shower][i] = 0;
      for( var m= 0; m<this.showers.length; m++) {
        stat[this.showers[m]][i] = 0;
      }
      stat['SPO'][i] = 0;
    }
  }

  cleanSheet() {
    let sheet = [];
    for (let i = 1; i < 1000; i++) {
      sheet[i] = [];  
    }
    return sheet;
  }

  cleanResults_(stat: {}): any {
    this.countDistribution = this.cleanSheet();
  
    this.countDistribution[1][1] = 'DATE UT';
    this.countDistribution[1][2] = 'START';
    this.countDistribution[1][3] = 'END';
    this.countDistribution[1][4] = 'Teff';
    this.countDistribution[1][5] = 'RA';
    this.countDistribution[1][6] = 'Dec';
    this.countDistribution[1][7] = 'F';
    this.countDistribution[1][8] = 'Lm';
    
    var names = this.getShowersNames_(stat);
    for(var i=0; i<names.length; i++ ) {
      this.countDistribution[1][9+2*i] = names[i];
      this.countDistribution[1][9+2*i+1] = '';
    }
  
    this.magnitudeDistribution = this.cleanSheet();
    this.magnitudeDistribution[1][ 1] = 'DATE UT';
    this.magnitudeDistribution[1][ 2] = 'START';
    this.magnitudeDistribution[1][ 3] = 'END';
    this.magnitudeDistribution[1][ 4] = 'SHOWER';
    this.magnitudeDistribution[1][ 5] = '-6';
    this.magnitudeDistribution[1][ 6] = '-5';
    this.magnitudeDistribution[1][ 7] = '-4';
    this.magnitudeDistribution[1][ 8] = '-3';
    this.magnitudeDistribution[1][ 9] = '-2';
    this.magnitudeDistribution[1][10] = '-1';
    this.magnitudeDistribution[1][11] = '0';
    this.magnitudeDistribution[1][12] = '1';
    this.magnitudeDistribution[1][13] = '2';
    this.magnitudeDistribution[1][14] = '3';
    this.magnitudeDistribution[1][15] = '4';
    this.magnitudeDistribution[1][16] = '5';
    this.magnitudeDistribution[1][17] = '6';
    this.magnitudeDistribution[1][18] = '7';
  }
  isTime_(dataValue: string): any {
    return typeof(dataValue) === 'string' && /^\d{4}$/.test(dataValue);
  }
  getTime_(dataValue: string): Date {
    var hours = parseInt(dataValue.slice(0,2));
    var minutes = parseInt(dataValue.slice(2,4));
    var time = new Date( this.curDate.getFullYear(), this.curDate.getMonth(), this.curDate.getDate(), hours, minutes);
    return time;
  }
  incDays_(date: Date): Date {
    var d = new Date(date);
    d.setDate( d.getDate() + 1 );
    return d;
  }
  decDays_(date: Date): Date {
    var d = new Date(date);
    d.setDate( d.getDate() - 1 );
    return d;
  }
  isSporadic_(dataValue: string): boolean {
    return  typeof dataValue === 'string' && dataValue.slice(-1) === '-';
  }
  addMeteorToStat_(stat: {}, name: string, mag: string) {
    let nmag = parseInt(mag);
    if( nmag < -6 || nmag > 7 )
      throw Error('Meteor magnitude ' + mag + ' no in range from -6 to 7. Please report meteors with magnitude less -6 in fairball forum');
    stat[name][mag]++;  
    this.stat[name][mag]++;  
          
  }
  
  addCountDistribution_(period: number, startTime: Date, endTime: Date, stat: {}): void {
    let row = period + 1;
    this.countDistribution[row][1] = this.timeToStringDate_(startTime);
    this.countDistribution[row][2] = this.timeToStringTime_(startTime);
    this.countDistribution[row][3] = this.timeToStringTime_(endTime);
    this.countDistribution[row][4] = Math.floor(Number(this.calcTeif_(startTime, endTime))*1000)/1000;
    this.countDistribution[row][5] = Number(this.calcRa_(startTime)).toFixed(2);
    this.countDistribution[row][6] = this.Dec;
    this.countDistribution[row][7] = this.calcF_().toFixed(2);
    this.countDistribution[row][8] = this.Lm.toFixed(2);
    
    var names = this.getShowersNames_(stat)
    for(var i=0; i<names.length; i++ ) {
      this.countDistribution[row][9+2*i] = 'C';
      this.countDistribution[row][10+2*i] = this.metCount_(stat, names[i]);
    }
  }

  metCount_(stat: {}, shower: string) {
  let count = 0;
    Object.keys(stat[shower]).forEach(function(key) {
        count += stat[shower][key];
    }); 
    return count;
  }

  getShowersNames_(stat): string[] {
    var names = [];
    Object.keys(stat).forEach(function(key) {
        if( key !== 'SPO' && key !== '')
          names.push(key);
    }); 
    names.sort();
    names.push('SPO');
    return names;
  }
  calcF_(): number {
    return 1/(1 - this.F/100);
  }
  calcRa_(startTime: Date): number {
    let RaStartTime = this.RaStartTime;
    if( RaStartTime > startTime  )
      RaStartTime = this.decDays_(RaStartTime);
    let deltaMins = (startTime.valueOf()-RaStartTime.valueOf())/(60*1000);
    return (deltaMins*this.RaDiffInMin + this.RaStartValue) % 360;
  }
  calcTeif_(startTime: Date, endTime: Date): number {
    return (endTime.valueOf()-startTime.valueOf())/(60*60*1000);
  }
  timeToStringTime_(time: Date): string {
    var hours = this.pad_(time.getUTCHours(), 2);
    var minutes = this.pad_(time.getUTCMinutes(), 2);
    return '' + hours  + minutes;
    }
  pad_(n: number, width: number): any {
    let s = n.toLocaleString() + '';
    return s.length >= width ? s : new Array(width - s.length + 1).join('0') + s;
    }
  timeToStringDate_(time: Date): any {
    const monthNames = [
      'Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct',
      'Nov', 'Dec'
    ];
    var day = time.getUTCDate();
    var month = monthNames[time.getUTCMonth()];
    var year = time.getUTCFullYear();
    return month + ' ' + day + ' ' + year;
  }
  addMagninudeDistribution_(period: number, startTime: Date, endTime: Date, stat: {}): void {
    var sheet = {}
    var names = this.getShowersNames_(stat);
    var row = (period-1)*names.length + 2;
    
    for( var i=0; i<names.length; i++) {
      this.magnitudeDistribution[row+i][1] = this.timeToStringDate_(startTime);
      this.magnitudeDistribution[row+i][2] = this.timeToStringTime_(startTime);
      this.magnitudeDistribution[row+i][3] = this.timeToStringTime_(endTime);
      this.magnitudeDistribution[row+i][4] = names[i];
      for(var j=0; j<14; j++) 
        this.magnitudeDistribution[row+i][5+j] = stat[names[i]][-6+j];
    }
  }
}
