import { Component } from '@angular/core';
import { MeteorService } from '../meteor.service';

@Component({
  selector: 'app-statistics',
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent {
  constructor(public meteorService: MeteorService) {}
}
