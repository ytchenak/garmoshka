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
});
