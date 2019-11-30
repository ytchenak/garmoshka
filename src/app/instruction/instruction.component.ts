import { Component, OnInit } from '@angular/core';
import { SettingFormComponent } from '../setting-form/setting-form.component';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.scss']
})
export class InstructionComponent implements OnInit {
  private settings = new SettingFormComponent(); 
  constructor() { }

  ngOnInit() {
  }

}
