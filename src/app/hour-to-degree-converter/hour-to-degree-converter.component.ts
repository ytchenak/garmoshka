import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hour-to-degree-converter',
  imports: [FormsModule],
  templateUrl: './hour-to-degree-converter.component.html',
  styleUrl: './hour-to-degree-converter.component.scss',
})
export class HourToDegreeConverterComponent {
  private _time = '';
  private _degrees = '';

  get time(): string {
    return this._time;
  }

  set time(value: string) {
    if (this._time !== value) {
      this._time = value;
      const deg = this.getTimeInSeconds(value) * (360 / 24 / 60 / 60);
      if (!isNaN(deg) && deg <= 360) {
        this._degrees = deg.toFixed(2).toString();
      } else {
        this._degrees = '';
      }
    }
  }

  get degrees(): string {
    return this._degrees;
  }

  set degrees(value: string) {
    if (this._degrees !== value) {
      this._degrees = value;
      const sec = parseFloat(value) / (360 / 24 / 60 / 60);
      if (!isNaN(sec) && sec <= 3600 * 24) {
        this._time = this.toHHMMSS(sec);
      } else {
        this._time = '';
      }
    }
  }

  private getTimeInSeconds(dataValue: string): number {
    if (dataValue.length === 6) {
      const hours = parseInt(dataValue.substring(0, 2));
      const minutes = parseInt(dataValue.substring(2, 4));
      const seconds = parseInt(dataValue.substring(4, 6));
      return hours * 3600 + minutes * 60 + seconds;
    }
    return NaN;
  }

  private toHHMMSS(secNum: number): string {
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum - hours * 3600) / 60);
    const seconds = Math.floor(secNum - hours * 3600 - minutes * 60);
    return hours.toString().padStart(2, '0') + minutes.toString().padStart(2, '0') + seconds.toString().padStart(2, '0');
  }
}
