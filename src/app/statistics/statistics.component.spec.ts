import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { StatisticsComponent } from './statistics.component';
import { MeteorService } from '../meteor.service';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [StatisticsComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have meteor service injected', () => {
    expect(component.meteorService).toBeTruthy();
    expect(component.meteorService).toBeInstanceOf(MeteorService);
  });

  it('should return 0 for maxMagnitudeCount when no stats', () => {
    component.meteorService.magnitudeStat = [];
    expect(component.maxMagnitudeCount).toBe(0);
  });

  it('should return max count from magnitude stats', () => {
    component.meteorService.magnitudeStat = [
      { name: '1', count: 5 },
      { name: '2', count: 10 },
      { name: '3', count: 3 },
    ];
    expect(component.maxMagnitudeCount).toBe(10);
  });

  it('should return at least 1 for maxMagnitudeCount with zero counts', () => {
    component.meteorService.magnitudeStat = [
      { name: '1', count: 0 },
      { name: '2', count: 0 },
    ];
    expect(component.maxMagnitudeCount).toBe(1);
  });

  it('should calculate bar width as percentage', () => {
    component.meteorService.magnitudeStat = [
      { name: '1', count: 5 },
      { name: '2', count: 10 },
    ];
    expect(component.barWidth(10)).toBe(100);
    expect(component.barWidth(5)).toBe(50);
    expect(component.barWidth(0)).toBe(0);
  });
});
