import { Component, OnInit } from '@angular/core';
import { MeteorService } from '../meteor.service';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { SettingFormComponent } from '../setting-form/setting-form.component';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { Module } from '@ag-grid-community/core';

@Component({
  selector: 'app-meteor-input',
  templateUrl: './meteor-input.component.html',
  styleUrls: ['./meteor-input.component.scss']
})
export class MeteorInputComponent implements OnInit {
  modules: Module[] = [ClientSideRowModelModule];

  columnDefs = [
    {headerName: '#', valueGetter: this.getIndex, editable: false, width: 50},
    {headerName: '', field: 'data', editable: true, width: 100, cellStyle: {'font-size': '20px'}},
  ];

  getIndex(params) {
    return params.node.childIndex + 1;
  }

  private gridApi;

  rowData: Array<{data: string}>;

  constructor(public meteorService: MeteorService,
    public storage: LocalStorageService) {
      this.rowData = this.storage.retrieve('rowdata');
  }

  ngOnInit() {
    if( !this.rowData) {
      this.rowData = this.cleanRowData();
      new SettingFormComponent(); //ensure that setting will be written in localstorage
    }

    this.calc();
  }

  private cleanRowData(): Array<{data: string}> {
    let rowData = new Array<{data: string}>();
    for (let i = 0; i < 999; i++) {
      rowData.push({data: ''});   
    }
    return rowData;
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.setFocusedCell(0, "data");
    
  }

  onClean() {
    if (confirm('All data will be deleted, are you sure?')) {
      this.rowData = this.cleanRowData();
      this.gridApi.setRowData(this.rowData);
      this.storage.store('rowdata', this.rowData);
      this.calc();
    }
  }

  onInsert() {
    let index = this.gridApi.getFocusedCell().rowIndex;
    this.rowData.splice(index+1, 0, {data: ''});
    this.gridApi.setRowData(this.rowData);
    this.storage.store('rowdata', this.rowData);
    this.gridApi.setFocusedCell(index, "data");
    this.gridApi.ensureIndexVisible(index, 'middle')
  }

  onDelete() {
    let index = this.gridApi.getFocusedCell().rowIndex;
    this.rowData.splice(index, 1);
    this.gridApi.setRowData(this.rowData);
    this.storage.store('rowdata', this.rowData);
    this.gridApi.setFocusedCell(index, "data");
    this.gridApi.ensureIndexVisible(index, 'middle')
  }

  get dataValues() {
    return this.rowData.map( x => x.data);
  }

  onCellValueChanged($event) {
    this.storage.store('rowdata', this.rowData);
    this.calc();
  }

  calc() {
    try {
      this.meteorService.calc(this.dataValues);
    } catch(e) {
      alert(e);
    }
  }


  private pasteFromClipboard(): Promise<void> {
    
    return navigator['clipboard'].readText()
      .then(text => {
        let data: string[] = text.split('\n');
        let i = 0;
        for(; i<data.length; i++) {
          this.rowData[i] = {data: data[i].trim()};
        }
        for(; i<999; i++) {
          this.rowData[i] = {data: ''}
        }
        this.gridApi.setRowData(this.rowData);
        this.storage.store('rowdata', this.rowData);
        this.calc();
      })
    .catch(err => {
      console.error('Failed to read clipboard contents: ', err);
    });
  }
  onPasteAll() {
    if (!confirm('All data will be deleted, are you sure?')) 
      return;
    setTimeout(() => this.pasteFromClipboard(),250);
  }
  onCopyAll() {
    let text = this.dataValues.join('\n');
    navigator['clipboard'].writeText(text)
      .catch(err => {
        console.error('Failed to write content to clipboard: ', err);
      });
  }

}
