import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-instruction',
  imports: [RouterLink],
  templateUrl: './instruction.component.html',
  styleUrl: './instruction.component.scss',
})
export class InstructionComponent {
  showers: string;

  constructor(private storage: StorageService) {
    this.showers = this.storage.getSetting('showers', '');
  }
}
