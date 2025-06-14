import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hour-to-degree-converter',
  templateUrl: './hour-to-degree-converter.component.html',
  styleUrls: ['./hour-to-degree-converter.component.scss']
})
export class HourToDegreeConverterComponent implements OnInit {

  public _time: string;
  public _degrees: string;

  private getTimeInSeconds(dataValue: string): number {
    if( dataValue.length === 6) {
      const hours = parseInt(dataValue.substr(0,2));
      const minutes = parseInt(dataValue.substr(2,2));
      const seconds = parseInt(dataValue.substr(4,2));
      return hours*3600 + minutes*60 + seconds;
    }
  }

  public get time() {
    return this._time;
  }

  public get degrees() {
    return this._degrees;
  }

  public set time( value: string) {
    if( this._time !== value ) {
      this._time = value;
      const deg = this.getTimeInSeconds(value) * (360/24/60/60);
      if( !isNaN(deg) && deg <= 360) {
        this._degrees = deg.toFixed(2).toString();
      } else {
        this._degrees = '';
      }
    }
  }


  private toHHMMSS(sec_num: number): string {
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));

    let str =
      hours.toString().padStart(2,'0')+
      minutes.toString().padStart(2,'0')+
      seconds.toString().padStart(2,'0');
    return str;
}

  public set degrees( value: string) {
    if( this._degrees !== value) {
      this._degrees = value;
      const sec = parseFloat(value) / (360/24/60/60);
      if( !isNaN(sec) && sec <= 3600*24) {
        this._time = this.toHHMMSS(sec);
      } else {
        this._time = '';
      }
    }
  }
  
  constructor() { }

  ngOnInit() {
  }

}
