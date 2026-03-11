import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MeteorService } from '../meteor.service';
import { StorageService } from '../storage.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-sheet',
  imports: [],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss',
})
export class SheetComponent implements OnInit {
  headers: (string | number | undefined)[] = [];
  rows: Array<Array<string | number | undefined>> = [];
  title = '';

  constructor(
    private meteorService: MeteorService,
    private storage: StorageService,
    private router: Router,
  ) {}

  getData(): Array<Array<string | number | undefined>> | null {
    if (this.router.url === '/count-distribution') {
      return this.meteorService.countDistribution;
    } else if (this.router.url === '/magnitude-distribution') {
      return this.meteorService.magnitudeDistribution;
    }
    return null;
  }

  ngOnInit(): void {
    const rowData = this.storage.getRowData();
    const dataValues = rowData ? rowData.map((r) => r.data) : [];
    this.meteorService.calc(dataValues);

    if (this.router.url === '/count-distribution') {
      this.title = 'Count Distribution';
    } else if (this.router.url === '/magnitude-distribution') {
      this.title = 'Magnitude Distribution';
    }

    const data = this.getData();
    if (!data) {
      return;
    }

    if (data[1]) {
      this.headers = data[1].slice(1);
    }

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] === undefined) {
        break;
      }
      this.rows.push(data[i].slice(1));
    }
  }

  onExport(): void {
    const name = this.storage.getSetting('name', '');
    let fileName = name ? name + ' ' : '';
    fileName += this.title;
    fileName += '.csv';

    const csvRows: string[] = [];
    csvRows.push(this.headers.map((h) => h ?? '').join(','));
    for (const row of this.rows) {
      csvRows.push(row.map((c) => c ?? '').join(','));
    }
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, fileName);
  }
}
