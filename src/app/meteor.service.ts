import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { DEFAULT_SETTINGS } from './meteor-settings';

export interface ShowerStat {
  name: string;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class MeteorService {
  F = 0;
  Lm = 0;
  curDate = new Date();
  shower = '';
  showers: string[] = [];
  Dec = 0;
  RaStartTime: Date | null = null;
  RaDiffInMin = 0.25;
  RaStartValue = 0;

  LmrRegex = /^[Ll][Mm]=([0-9]+\.?[0-9]*)$/;
  DecRegex = /^[Dd][Ee][Cc]=([0-9]+\.?[0-9]*)$/;
  RaRegex = /^[Rr][Aa]=([0-9]+\.?[0-9]*)$/;

  countDistribution: Array<Array<string | number | undefined>> = [];
  magnitudeDistribution: Array<Array<string | number | undefined>> = [];
  spoCount = 0;
  showerCount = 0;
  stat: Record<string, Record<number, number>> = {};
  showersStat: ShowerStat[] = [];
  magnitudeStat: ShowerStat[] = [];
  currentRow = 0;

  constructor(private storage: StorageService) {}

  calc(dataValues: string[]): void {
    this.readSetting();

    let period = 1;

    const stat: Record<string, Record<number, number>> = {};
    this.initStat(stat);
    this.stat = {};
    this.initStat(this.stat);
    let startTime: Date | null = null;
    let endTime: Date | null = null;

    let skip = false;

    this.cleanResults(stat);
    this.spoCount = 0;
    this.showerCount = 0;

    for (let i = 0; i < dataValues.length; i++) {
      this.currentRow = i + 1;
      const dataValue = dataValues[i];

      if (dataValue === '') {
        continue;
      } else if (i > 0 && dataValues[i - 1] === '//' && !this.isTime(dataValue)) {
        throw Error('Observation break without start time in input column row ' + this.currentRow);
      } else if (dataValue === '//') {
        if (!this.isTime(dataValues[i - 1])) {
          throw Error('Observation break without end time in input column row ' + this.currentRow);
        }
        skip = true;
      } else if (/^\d+%$/.test(dataValue)) {
        this.F = parseFloat(dataValue.slice(0, -1));
        if (this.F >= 80) {
          throw Error('Field of obstruction is too large: ' + dataValue + ' in input column row ' + this.currentRow);
        }
      } else if (this.isLm(dataValue)) {
        this.Lm = this.getLm(dataValue);
      } else if (this.isDec(dataValue)) {
        this.Dec = this.getDec(dataValue);
      } else if (this.isRa(dataValue)) {
        this.RaStartValue = this.getRa(dataValue);
        this.RaStartTime = endTime ? endTime : startTime;
      } else if (this.isTime(dataValue)) {
        if (!startTime) {
          startTime = this.getTime(dataValue);
          this.initStat(stat);
        } else {
          if (endTime) {
            startTime = endTime;
          }
          endTime = this.getTime(dataValue);
          if (startTime > endTime) {
            this.curDate = this.incDays(this.curDate);
            endTime = this.getTime(dataValue);
          }

          if (this.calcTeff(startTime, endTime) > 12) {
            throw new Error('end time is less than start time: ' + dataValue + ' in Input column row ' + this.currentRow);
          }

          if (this.calcTeff(startTime, endTime) === 0) {
            throw new Error('end time is equal to start time: ' + dataValue + ' in Input column row ' + this.currentRow);
          }

          if (skip) {
            skip = false;
            continue;
          }

          this.addCountDistribution(period, startTime, endTime, stat);
          this.addMagnitudeDistribution(period, startTime, endTime, stat);
          this.initStat(stat);

          period++;
        }
      } else {
        if (this.isSporadic(dataValue)) {
          const mag = dataValue.slice(0, -1);
          this.addMeteorToStat(stat, 'SPO', mag);
          this.spoCount += 1;
        } else if (this.isDefaultShower(dataValue)) {
          const mag = dataValue;
          this.addMeteorToStat(stat, this.shower, mag);
          this.showerCount += 1;
        } else if (this.isMinorShower(dataValue)) {
          const name = dataValue.slice(-3);
          const mag = dataValue.slice(0, -3);
          this.addMeteorToStat(stat, name, mag);
        } else {
          throw new Error('Unknown value ' + dataValue + ' in Input column row ' + this.currentRow);
        }
      }
    }
    this.calcStatistics();
  }

  calcStatistics(): void {
    this.showersStat = [];
    for (const showerName in this.stat) {
      let count = 0;
      const magnitudes = this.stat[showerName];
      for (const m in magnitudes) {
        count += magnitudes[+m];
      }
      this.showersStat.push({ name: showerName, count });
    }

    const mags: Record<number, number> = {};
    for (const showerName in this.stat) {
      const magnitudes = this.stat[showerName];
      for (const m in magnitudes) {
        if (isNaN(mags[+m])) {
          mags[+m] = 0;
        }
        mags[+m] += magnitudes[+m];
      }
    }
    this.magnitudeStat = [];
    for (const m in mags) {
      this.magnitudeStat.push({ name: m, count: mags[+m] });
    }
    this.magnitudeStat = this.magnitudeStat.sort((a, b) => +a.name - +b.name);
  }

  readSetting(): void {
    this.shower = this.storage.getSetting('shower', DEFAULT_SETTINGS.shower);
    this.showers = this.storage.getSetting('showers', DEFAULT_SETTINGS.showers).split(',');
    const curDateStr = this.storage.getSetting('curDate', DEFAULT_SETTINGS.curDate);
    const parts = curDateStr.split('/');
    this.curDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    this.F = parseFloat(this.storage.getSetting('F', DEFAULT_SETTINGS.F));
    this.Lm = parseFloat(this.storage.getSetting('Lm', DEFAULT_SETTINGS.Lm));
    this.Dec = parseFloat(this.storage.getSetting('Dec', DEFAULT_SETTINGS.Dec));
    this.RaStartTime = this.getTime(this.storage.getSetting('RaStartTime', DEFAULT_SETTINGS.RaStartTime));
    this.RaStartValue = parseFloat(this.storage.getSetting('RaStartValue', DEFAULT_SETTINGS.RaStartValue));
  }

  isMinorShower(dataValue: string): boolean {
    const regex = /^-?\d[A-Z]{3}$/;
    if (regex.test(dataValue)) {
      const name = dataValue.slice(-3);
      return this.showers.indexOf(name) >= 0;
    }
    return false;
  }

  isDefaultShower(dataValue: string): boolean {
    const regex = /^-?\d$/;
    return regex.test(dataValue);
  }

  isLm(dataValue: string): boolean {
    return this.LmrRegex.test(dataValue);
  }

  getLm(dataValue: string): number {
    return parseFloat(dataValue.match(this.LmrRegex)![1]);
  }

  isDec(dataValue: string): boolean {
    return this.DecRegex.test(dataValue);
  }

  getDec(dataValue: string): number {
    return parseFloat(dataValue.match(this.DecRegex)![1]);
  }

  isRa(dataValue: string): boolean {
    return this.RaRegex.test(dataValue);
  }

  getRa(dataValue: string): number {
    return parseFloat(dataValue.match(this.RaRegex)![1]);
  }

  initStat(stat: Record<string, Record<number, number>>): void {
    stat[this.shower] = {};
    for (let m = 0; m < this.showers.length; m++) {
      const name = this.showers[m];
      if (name !== '') {
        stat[name] = {};
      }
    }
    stat['SPO'] = {};

    for (let i = -6; i <= 7; i++) {
      stat[this.shower][i] = 0;
      for (let m = 0; m < this.showers.length; m++) {
        const name = this.showers[m];
        if (name !== '') {
          stat[name][i] = 0;
        }
      }
      stat['SPO'][i] = 0;
    }
  }

  cleanSheet(): Array<Array<string | number | undefined>> {
    const sheet: Array<Array<string | number | undefined>> = [];
    for (let i = 1; i < 1000; i++) {
      sheet[i] = [];
    }
    return sheet;
  }

  cleanResults(stat: Record<string, Record<number, number>>): void {
    this.countDistribution = this.cleanSheet();

    this.countDistribution[1][1] = 'DATE UT';
    this.countDistribution[1][2] = 'START';
    this.countDistribution[1][3] = 'END';
    this.countDistribution[1][4] = 'Teff';
    this.countDistribution[1][5] = 'RA';
    this.countDistribution[1][6] = 'Dec';
    this.countDistribution[1][7] = 'F';
    this.countDistribution[1][8] = 'Lm';

    const names = this.getShowersNames(stat);
    for (let i = 0; i < names.length; i++) {
      this.countDistribution[1][9 + 2 * i] = names[i];
      this.countDistribution[1][9 + 2 * i + 1] = '';
    }

    this.magnitudeDistribution = this.cleanSheet();
    this.magnitudeDistribution[1][1] = 'DATE UT';
    this.magnitudeDistribution[1][2] = 'START';
    this.magnitudeDistribution[1][3] = 'END';
    this.magnitudeDistribution[1][4] = 'SHOWER';
    this.magnitudeDistribution[1][5] = '-6';
    this.magnitudeDistribution[1][6] = '-5';
    this.magnitudeDistribution[1][7] = '-4';
    this.magnitudeDistribution[1][8] = '-3';
    this.magnitudeDistribution[1][9] = '-2';
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

  isTime(dataValue: string): boolean {
    return typeof dataValue === 'string' && /^(?:[01]\d|2[0-3])[0-5]\d$/.test(dataValue);
  }

  getTime(dataValue: string): Date {
    const hours = parseInt(dataValue.slice(0, 2));
    const minutes = parseInt(dataValue.slice(2, 4));
    return new Date(this.curDate.getFullYear(), this.curDate.getMonth(), this.curDate.getDate(), hours, minutes);
  }

  incDays(date: Date): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d;
  }

  decDays(date: Date): Date {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return d;
  }

  isSporadic(dataValue: string): boolean {
    return typeof dataValue === 'string' && dataValue.slice(-1) === '-';
  }

  addMeteorToStat(stat: Record<string, Record<number, number>>, name: string, mag: string): void {
    const nmag = parseInt(mag);
    if (nmag < -6 || nmag > 7) {
      throw Error(
        'Meteor magnitude ' +
          mag +
          ' not in range from -6 to 7. Please report meteors with magnitude less than -6 in fireball forum. Input column row ' +
          this.currentRow,
      );
    }
    stat[name][nmag]++;
    this.stat[name][nmag]++;
  }

  addCountDistribution(
    period: number,
    startTime: Date,
    endTime: Date,
    stat: Record<string, Record<number, number>>,
  ): void {
    const row = period + 1;
    this.countDistribution[row][1] = this.timeToStringDate(startTime);
    this.countDistribution[row][2] = this.timeToStringTime(startTime);
    this.countDistribution[row][3] = this.timeToStringTime(endTime);
    this.countDistribution[row][4] = Math.floor(Number(this.calcTeff(startTime, endTime)) * 1000) / 1000;
    this.countDistribution[row][5] = Number(this.calcRa(startTime)).toFixed(2);
    this.countDistribution[row][6] = this.Dec;
    this.countDistribution[row][7] = this.calcF().toFixed(2);
    this.countDistribution[row][8] = this.Lm.toFixed(2);

    const names = this.getShowersNames(stat);
    for (let i = 0; i < names.length; i++) {
      this.countDistribution[row][9 + 2 * i] = 'C';
      this.countDistribution[row][10 + 2 * i] = this.metCount(stat, names[i]);
    }
  }

  metCount(stat: Record<string, Record<number, number>>, shower: string): number {
    let count = 0;
    Object.keys(stat[shower]).forEach((key) => {
      count += stat[shower][+key];
    });
    return count;
  }

  getShowersNames(stat: Record<string, Record<number, number>>): string[] {
    const names: string[] = [];
    Object.keys(stat).forEach((key) => {
      if (key !== 'SPO' && key !== '') {
        names.push(key);
      }
    });
    names.sort();
    names.push('SPO');
    return names;
  }

  calcF(): number {
    return 1 / (1 - this.F / 100);
  }

  calcRa(startTime: Date): number {
    let raStartTime = this.RaStartTime;
    if (raStartTime && raStartTime > startTime) {
      raStartTime = this.decDays(raStartTime);
    }
    const deltaMins = raStartTime ? (startTime.valueOf() - raStartTime.valueOf()) / (60 * 1000) : 0;
    return (deltaMins * this.RaDiffInMin + this.RaStartValue) % 360;
  }

  calcTeff(startTime: Date, endTime: Date): number {
    return (endTime.valueOf() - startTime.valueOf()) / (60 * 60 * 1000);
  }

  timeToStringTime(time: Date): string {
    const hours = this.pad(time.getUTCHours(), 2);
    const minutes = this.pad(time.getUTCMinutes(), 2);
    return '' + hours + minutes;
  }

  pad(n: number, width: number): string {
    const s = n.toString();
    return s.length >= width ? s : new Array(width - s.length + 1).join('0') + s;
  }

  timeToStringDate(time: Date): string {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = time.getUTCDate();
    const month = monthNames[time.getUTCMonth()];
    const year = time.getUTCFullYear();
    return month + ' ' + day + ' ' + year;
  }

  addMagnitudeDistribution(
    period: number,
    startTime: Date,
    endTime: Date,
    stat: Record<string, Record<number, number>>,
  ): void {
    const names = this.getShowersNames(stat);
    const row = (period - 1) * names.length + 2;

    for (let i = 0; i < names.length; i++) {
      this.magnitudeDistribution[row + i][1] = this.timeToStringDate(startTime);
      this.magnitudeDistribution[row + i][2] = this.timeToStringTime(startTime);
      this.magnitudeDistribution[row + i][3] = this.timeToStringTime(endTime);
      this.magnitudeDistribution[row + i][4] = names[i];
      for (let j = 0; j < 14; j++) {
        this.magnitudeDistribution[row + i][5 + j] = stat[names[i]][-6 + j];
      }
    }
  }
}
