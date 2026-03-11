import { TestBed } from '@angular/core/testing';
import { MeteorService } from './meteor.service';
import { StorageService } from './storage.service';

describe('MeteorService', () => {
  let service: MeteorService;

  beforeEach(() => {
    localStorage.clear();
    const storageService = new StorageService();
    storageService.setSetting('shower', 'PER');
    storageService.setSetting('showers', '');
    storageService.setSetting('curDate', '12/08/2024');
    storageService.setSetting('F', '0');
    storageService.setSetting('Lm', '5.75');
    storageService.setSetting('Dec', '30');
    storageService.setSetting('RaStartTime', '1900');
    storageService.setSetting('RaStartValue', '236');

    TestBed.configureTestingModule({});
    service = TestBed.inject(MeteorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should read settings from storage', () => {
    service.readSetting();
    expect(service.shower).toBe('PER');
    expect(service.Lm).toBe(5.75);
    expect(service.Dec).toBe(30);
    expect(service.F).toBe(0);
  });

  it('should handle empty data', () => {
    service.calc([]);
    expect(service.spoCount).toBe(0);
    expect(service.showerCount).toBe(0);
    expect(service.showersStat.length).toBeGreaterThan(0);
  });

  it('should recognize time values', () => {
    expect(service.isTime('2100')).toBeTrue();
    expect(service.isTime('0000')).toBeTrue();
    expect(service.isTime('2359')).toBeTrue();
    expect(service.isTime('2400')).toBeFalse();
    expect(service.isTime('abc')).toBeFalse();
    expect(service.isTime('')).toBeFalse();
  });

  it('should recognize sporadic meteors', () => {
    expect(service.isSporadic('3-')).toBeTrue();
    expect(service.isSporadic('-1-')).toBeTrue();
    expect(service.isSporadic('3')).toBeFalse();
  });

  it('should recognize default shower meteors', () => {
    expect(service.isDefaultShower('3')).toBeTrue();
    expect(service.isDefaultShower('-1')).toBeTrue();
    expect(service.isDefaultShower('33')).toBeFalse();
    expect(service.isDefaultShower('abc')).toBeFalse();
  });

  it('should recognize Lm values', () => {
    expect(service.isLm('Lm=5.5')).toBeTrue();
    expect(service.isLm('lm=6.1')).toBeTrue();
    expect(service.isLm('Lm5.5')).toBeFalse();
    expect(service.getLm('Lm=5.5')).toBe(5.5);
  });

  it('should recognize Dec values', () => {
    expect(service.isDec('Dec=35')).toBeTrue();
    expect(service.isDec('dec=35')).toBeTrue();
    expect(service.getDec('Dec=35')).toBe(35);
  });

  it('should recognize Ra values', () => {
    expect(service.isRa('Ra=275')).toBeTrue();
    expect(service.isRa('RA=275')).toBeTrue();
    expect(service.getRa('RA=275')).toBe(275);
  });

  it('should calculate a simple observation session', () => {
    const data = ['2100', '3', '2-', '2200'];
    service.calc(data);
    expect(service.showerCount).toBe(1);
    expect(service.spoCount).toBe(1);
    expect(service.countDistribution[2]).toBeDefined();
  });

  it('should handle multiple periods', () => {
    const data = ['2100', '3', '2200', '2', '2300'];
    service.calc(data);
    expect(service.showerCount).toBe(2);
    expect(service.countDistribution[2]).toBeDefined();
    expect(service.countDistribution[3]).toBeDefined();
  });

  it('should throw error for unknown values', () => {
    const data = ['2100', 'INVALID', '2200'];
    expect(() => service.calc(data)).toThrowError(/Unknown value/);
  });

  it('should throw error for F >= 80', () => {
    const data = ['80%'];
    expect(() => service.calc(data)).toThrowError(/Field of obstruction is too large/);
  });

  it('should throw error for equal start and end time', () => {
    const data = ['2100', '2100'];
    expect(() => service.calc(data)).toThrowError(/end time is equal to start time/);
  });

  it('should handle Lm override in data', () => {
    const data = ['2100', 'Lm=6.1', '3', '2200'];
    service.calc(data);
    expect(service.Lm).toBe(6.1);
  });

  it('should handle Dec override in data', () => {
    const data = ['2100', 'Dec=45', '3', '2200'];
    service.calc(data);
    expect(service.Dec).toBe(45);
  });

  it('should handle F override in data', () => {
    const data = ['2100', '20%', '3', '2200'];
    service.calc(data);
    expect(service.F).toBe(20);
  });

  it('should handle observation break', () => {
    const data = ['2100', '3', '2200', '//', '2300', '2', '2359'];
    service.calc(data);
    expect(service.showerCount).toBe(2);
  });

  it('should throw error for observation break without end time', () => {
    const data = ['2100', '3', '//', '2300'];
    expect(() => service.calc(data)).toThrowError(/Observation break without end time/);
  });

  it('should handle magnitude out of range', () => {
    service.readSetting();
    const stat: Record<string, Record<number, number>> = {};
    service.initStat(stat);
    expect(() => service.addMeteorToStat(stat, 'PER', '8')).toThrowError(/not in range/);
  });

  it('should format time correctly', () => {
    const date = new Date(Date.UTC(2024, 7, 12, 21, 30));
    expect(service.timeToStringTime(date)).toBe('2130');
  });

  it('should format date correctly', () => {
    const date = new Date(Date.UTC(2024, 7, 12));
    expect(service.timeToStringDate(date)).toBe('Aug 12 2024');
  });

  it('should pad numbers correctly', () => {
    expect(service.pad(5, 2)).toBe('05');
    expect(service.pad(12, 2)).toBe('12');
    expect(service.pad(0, 2)).toBe('00');
  });

  it('should calculate Teff correctly', () => {
    const start = new Date(2024, 7, 12, 21, 0);
    const end = new Date(2024, 7, 12, 22, 0);
    expect(service.calcTeff(start, end)).toBe(1);
  });

  it('should calculate F correction correctly', () => {
    service.F = 0;
    expect(service.calcF()).toBe(1);
    service.F = 50;
    expect(service.calcF()).toBe(2);
  });

  it('should increment and decrement days', () => {
    const date = new Date(2024, 7, 12);
    const next = service.incDays(date);
    expect(next.getDate()).toBe(13);
    const prev = service.decDays(date);
    expect(prev.getDate()).toBe(11);
  });

  it('should calculate statistics correctly', () => {
    const data = ['2100', '3', '2', '-1', '2-', '4-', '2200'];
    service.calc(data);
    const perStat = service.showersStat.find((s) => s.name === 'PER');
    expect(perStat?.count).toBe(3);
    const spoStat = service.showersStat.find((s) => s.name === 'SPO');
    expect(spoStat?.count).toBe(2);
  });

  it('should calculate magnitude statistics correctly', () => {
    const data = ['2100', '3', '3', '2', '2200'];
    service.calc(data);
    expect(service.magnitudeStat.length).toBeGreaterThan(0);
    const mag3 = service.magnitudeStat.find((s) => s.name === '3');
    expect(mag3?.count).toBe(2);
    const mag2 = service.magnitudeStat.find((s) => s.name === '2');
    expect(mag2?.count).toBe(1);
  });

  it('should handle minor showers', () => {
    const storageService = TestBed.inject(StorageService);
    storageService.setSetting('showers', 'CAP,SDA');
    const data = ['2100', '3CAP', '2SDA', '2200'];
    service.calc(data);
    const capStat = service.showersStat.find((s) => s.name === 'CAP');
    expect(capStat?.count).toBe(1);
    const sdaStat = service.showersStat.find((s) => s.name === 'SDA');
    expect(sdaStat?.count).toBe(1);
  });

  it('should generate count distribution header correctly', () => {
    service.calc([]);
    expect(service.countDistribution[1][1]).toBe('DATE UT');
    expect(service.countDistribution[1][2]).toBe('START');
    expect(service.countDistribution[1][3]).toBe('END');
    expect(service.countDistribution[1][4]).toBe('Teff');
  });

  it('should generate magnitude distribution header correctly', () => {
    service.calc([]);
    expect(service.magnitudeDistribution[1][1]).toBe('DATE UT');
    expect(service.magnitudeDistribution[1][4]).toBe('SHOWER');
    expect(service.magnitudeDistribution[1][5]).toBe('-6');
    expect(service.magnitudeDistribution[1][18]).toBe('7');
  });
});
