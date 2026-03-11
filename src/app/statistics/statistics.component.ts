import { Component, inject } from '@angular/core';
import { MeteorService } from '../meteor.service';

@Component({
  selector: 'app-statistics',
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent {
  meteorService = inject(MeteorService);


  get maxMagnitudeCount(): number {
    if (this.meteorService.magnitudeStat.length === 0) return 0;
    return Math.max(...this.meteorService.magnitudeStat.map((m) => m.count), 1);
  }

  barWidth(count: number): number {
    const max = this.maxMagnitudeCount;
    return max > 0 ? (count / max) * 100 : 0;
  }
}
