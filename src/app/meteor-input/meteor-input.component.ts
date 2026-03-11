import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MeteorService } from '../meteor.service';
import { StorageService } from '../storage.service';
import { StatisticsComponent } from '../statistics/statistics.component';
import { InstructionComponent } from '../instruction/instruction.component';

@Component({
  selector: 'app-meteor-input',
  imports: [FormsModule, StatisticsComponent, InstructionComponent],
  templateUrl: './meteor-input.component.html',
  styleUrl: './meteor-input.component.scss',
})
export class MeteorInputComponent implements OnInit {
  error = '';
  inputText = '';

  constructor(
    public meteorService: MeteorService,
    private storage: StorageService,
  ) {}

  ngOnInit(): void {
    const rowData = this.storage.getRowData();
    if (rowData) {
      this.inputText = rowData.map((r) => r.data).join('\n');
    }
    this.calc();
  }

  get dataValues(): string[] {
    return this.inputText.split('\n');
  }

  onInputChange(): void {
    const rowData = this.dataValues.map((d) => ({ data: d }));
    this.storage.setRowData(rowData);
    this.calc();
  }

  onClean(): void {
    if (confirm('All data will be deleted, are you sure?')) {
      this.inputText = '';
      this.storage.setRowData([]);
      this.calc();
    }
  }

  calc(): void {
    try {
      this.error = '';
      this.meteorService.calc(this.dataValues);
    } catch (e) {
      this.error = String(e);
    }
  }

  async onPasteAll(): Promise<void> {
    if (!confirm('All data will be replaced, are you sure?')) {
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      this.inputText = text.trim();
      this.onInputChange();
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  }

  async onCopyAll(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.inputText);
    } catch (err) {
      console.error('Failed to write to clipboard: ', err);
    }
  }
}
