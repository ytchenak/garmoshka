import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meteor-input',
  templateUrl: './meteor-input.component.html',
  styleUrls: ['./meteor-input.component.scss']
})
export class MeteorInputComponent implements OnInit {

  columnDefs = [
    {headerName: '#', field: 'index', width: 50},
    {headerName: 'Data', field: 'data'  , editable: true},
  ];

  private gridApi;

  rowData = [];


  constructor() { 
    for (let i = 0; i < 999; i++) {
      this.rowData.push({index: i+1, data: ''});   
    }
  }

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.setFocusedCell(0, "data");
    
  }

  onClean() {
    this.rowData.forEach( x => x.data = '');
    this.gridApi.setRowData(this.rowData);
  }

  onInsert() {
    let index = this.gridApi.getFocusedCell().rowIndex;
    this.rowData.splice(index+1, 0, [{index: index, data: ''}]);
    let i = 1;
    this.rowData.forEach( x => x.index = i++);
    this.gridApi.setRowData(this.rowData);
    this.gridApi.setFocusedCell(index, "data");
  }

  onDelete() {
    let index = this.gridApi.getFocusedCell().rowIndex;
    this.rowData.splice(index, 1);
    let i = 1;
    this.rowData.forEach( x => x.index = i++);
    this.gridApi.setRowData(this.rowData);
    this.gridApi.setFocusedCell(index, "data");
  }

  onCalc() {

  }
}
