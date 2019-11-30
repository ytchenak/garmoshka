import { Component, OnInit } from '@angular/core';
import { MeteorService } from '../meteor.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  public showersStat = [];

  constructor(public meteorService: MeteorService) { 
  }

  ngOnInit() {
    
  }

}
