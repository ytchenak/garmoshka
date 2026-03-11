import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  errorRow = 0;
  inputText = '';
  lineNumbers: number[] = [1];

  @ViewChild('lineGutter') lineGutter!: ElementRef<HTMLDivElement>;
  @ViewChild('dataTextarea') dataTextarea!: ElementRef<HTMLTextAreaElement>;

  constructor(
    public meteorService: MeteorService,
    private storage: StorageService,
  ) {}

  ngOnInit(): void {
    const rowData = this.storage.getRowData();
    if (rowData) {
      this.inputText = rowData.map((r) => r.data).join('\n');
    }
    this.updateLineNumbers();
    this.calc();
  }

  get dataValues(): string[] {
    return this.inputText.split('\n');
  }

  updateLineNumbers(): void {
    const count = this.inputText === '' ? 1 : this.inputText.split('\n').length;
    this.lineNumbers = Array.from({ length: count }, (_, i) => i + 1);
  }

  onInputChange(): void {
    this.updateLineNumbers();
    const rowData = this.dataValues.map((d) => ({ data: d }));
    this.storage.setRowData(rowData);
    this.calc();
  }

  onClean(): void {
    if (confirm('All data will be deleted, are you sure?')) {
      this.inputText = '';
      this.updateLineNumbers();
      this.storage.setRowData([]);
      this.calc();
    }
  }

  calc(): void {
    try {
      this.error = '';
      this.errorRow = 0;
      this.meteorService.calc(this.dataValues);
    } catch (e) {
      this.error = String(e);
      const match = this.error.match(/row\s+(\d+)/i);
      this.errorRow = match ? parseInt(match[1], 10) : 0;
    }
  }

  syncScroll(): void {
    if (this.lineGutter && this.dataTextarea) {
      this.lineGutter.nativeElement.scrollTop = this.dataTextarea.nativeElement.scrollTop;
    }
  }

  onScroll(): void {
    this.syncScroll();
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
