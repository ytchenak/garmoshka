import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-instruction',
  imports: [RouterLink],
  templateUrl: './instruction.component.html',
  styleUrl: './instruction.component.scss',
})
export class InstructionComponent {
  private storage = inject(StorageService);

  showers: string;

  constructor() {
    this.showers = this.storage.getSetting('showers', '');
  }
}
